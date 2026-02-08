'use client'

import { getAllProfessorNotificationsService } from '@/services/tracks'
import { useEffect, useState } from 'react'

interface Notification {
  alunoId: number
  nome: string
  mediaErroPercentual: string
  mediaErroExecucaoPercentual: string
  dificuldadeExecucao: string
  mediaErroLogicoPercentual: string
  dificuldadeLogico: string
  ultimaTentativa?: string
}

interface NotificacoesPorTrilha {
  trilhaId: number
  trilhaNome: string
  notificacoes: Notification[]
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<
    (Notification & { trackTitle: string; nova?: boolean })[]
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const trilhas: NotificacoesPorTrilha[] = await getAllProfessorNotificationsService()

        const ultimaVisitaStr = localStorage.getItem('ultimaVisitaNotificacoes')
        const ultimaVisita = ultimaVisitaStr ? new Date(ultimaVisitaStr) : null

        const allNotifications: (Notification & { trackTitle: string; nova?: boolean })[] = []

        for (const trilha of trilhas) {
          const notificacoesArray = Array.isArray(trilha.notificacoes)
            ? trilha.notificacoes
            : []

          const notificacoesComTrilha = notificacoesArray.map((n) => {
            const nova =
              ultimaVisita && n.ultimaTentativa
                ? new Date(n.ultimaTentativa) > ultimaVisita
                : false

            return {
              ...n,
              trackTitle: trilha.trilhaNome,
              nova,
            }
          })

          allNotifications.push(...notificacoesComTrilha)
        }

        const onlyWithDifficulties = allNotifications.filter(
          (n) =>
            n.dificuldadeExecucao !== 'Nenhuma' ||
            n.dificuldadeLogico !== 'Nenhuma'
        )

        // 🔥 Ordena por dificuldade (Avançada > Moderada > Leve > Nenhuma) e depois por data
        onlyWithDifficulties.sort((a, b) => {
          const prioridade: Record<string, number> = {
            Avançada: 3,
            Moderada: 2,
            Leve: 1,
            Nenhuma: 0,
          }

          const dificuldadeA = Math.max(
            prioridade[a.dificuldadeExecucao] || 0,
            prioridade[a.dificuldadeLogico] || 0
          )
          const dificuldadeB = Math.max(
            prioridade[b.dificuldadeExecucao] || 0,
            prioridade[b.dificuldadeLogico] || 0
          )

          if (dificuldadeB !== dificuldadeA) {
            return dificuldadeB - dificuldadeA
          }

          const dateA = a.ultimaTentativa ? new Date(a.ultimaTentativa).getTime() : 0
          const dateB = b.ultimaTentativa ? new Date(b.ultimaTentativa).getTime() : 0
          return dateB - dateA
        })

        setNotifications(onlyWithDifficulties)

        localStorage.setItem('ultimaVisitaNotificacoes', new Date().toISOString())
      } catch (err) {
        console.error('Erro ao buscar notificações:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  const getTipoDificuldade = (notification: Notification): string => {
    const { dificuldadeExecucao, dificuldadeLogico } = notification

    if (dificuldadeExecucao !== 'Nenhuma' && dificuldadeLogico === 'Nenhuma') {
      return `Dificuldade ${dificuldadeExecucao.toLowerCase()} em erros de execução`
    } else if (
      dificuldadeLogico !== 'Nenhuma' &&
      dificuldadeExecucao === 'Nenhuma'
    ) {
      return `Dificuldade ${dificuldadeLogico.toLowerCase()} em erros lógicos`
    } else if (
      dificuldadeExecucao !== 'Nenhuma' &&
      dificuldadeLogico !== 'Nenhuma'
    ) {
      return `Dificuldade ${dificuldadeExecucao.toLowerCase()} em execução e ${dificuldadeLogico.toLowerCase()} em lógica`
    } else {
      return 'Nenhuma dificuldade detectada'
    }
  }

  const formatarData = (data?: string) => {
    if (!data) return null
    const d = new Date(data)
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) return <p>Carregando notificações...</p>

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-4">Notificações de Dificuldade</h1>

      {notifications.length === 0 ? (
        <p className="text-gray-600">Nenhuma dificuldade encontrada.</p>
      ) : (
        notifications.map((notification, idx) => (
          <div
            key={idx}
            className={`p-4 bg-white rounded-lg border ${
              notification.nova
                ? 'border-red-500 shadow-md shadow-red-100'
                : 'border-gray-200'
            }`}
          >
            {notification.nova && (
              <span className="text-xs text-red-600 font-bold uppercase mb-2 inline-block">
                Novo
              </span>
            )}
            <p className="text-lg font-semibold text-red-600 mb-1">
              {getTipoDificuldade(notification)}
            </p>
            <p className="font-medium">Aluno: {notification.nome}</p>
            <p className="text-sm text-gray-600">
              Trilha: <strong>{notification.trackTitle}</strong>
            </p>
            <p className="text-sm text-gray-600">
              Média de erro total: {notification.mediaErroPercentual}%
            </p>
            <p className="text-sm text-gray-600">
              Média de erro de execução: {notification.mediaErroExecucaoPercentual}%
            </p>
            <p className="text-sm text-gray-600">
              Média de erro lógico: {notification.mediaErroLogicoPercentual}%
            </p>
            {notification.ultimaTentativa && (
              <p className="text-sm text-gray-500 italic">
                Última tentativa em: {formatarData(notification.ultimaTentativa)}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  )
}
