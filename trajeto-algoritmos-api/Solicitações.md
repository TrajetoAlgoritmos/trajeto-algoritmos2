já vou deixar registrado aqui, mas depois reforço: preciso de algumas rotas
1 - Lado do aluno: Get das trilhas que o aluno deu JOIN
-> GET /student/joinedTracks
2 - Lado do aluno: Get By ID da trilha que o aluno deu JOIN (tem o Get by ID geral, o que imagino que o aluno pode dar o GET em qualquer uma)
-> GET /student/tracks/:id
3 - Lado do aluno: Ao submeter um exercício da trilha salvar essa submissão e/ou o exercício para o aluno continuar mais tarde
-> GET /student/getLastAnswer -> enviar como parametro de busca o trackAlgorithmId
4 - Lado do professor: Lista de alunos cadastrados na trilha do Get By ID da trilha
-> ja tem no GET /tracks/:id
5 - Lado do professor: Dentro da lista de alunos do Get By ID da trilha, trazer o progresso do aluno (ex: quantas questoes submeteu e o código pra correção)
-> Adicionei no GET /tracks/:id
students.answers = {
correct: 0,
incorrect: 0,
error: 0,
running: 0,
notAnswered: 0,
}

Mais uma:
Do lado do aluno: No Get da lista de trilhas que o user deu JOIN, preciso do status do exereícios se foi feito ou não (que no front aqui eeu coloco quantos % da trilha foi feito, tbm consigo bolar um status aqui)

- ok, adicionado no /student/joinedTracks, para cada exercicio, um status
