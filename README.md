# TRAJETO ALGORITMOS

### MODO DEV (Recomenda-se o uso de sistemas Linux ou macOS)

Obs: Não testado em ambientes Windows

1 - Adicionar permissão

```bash
  chmod +x start.sh
```

2 - Executar o app

```bash
  ./start.sh
```

- Caso alguma variável de ambiente seja alterada:
- Atenção: Este comando remove todos os volumes!

```bash
docker volume rm $(docker volume ls -q)
```

### FIX ISSUE UBUNTU 22 _"'/box': No such file or directory"_

```plaintext
sudo nano /etc/default/grub
# edit this line, and save:
GRUB_CMDLINE_LINUX="systemd.unified_cgroup_hierarchy=0"
sudo update-grub
sudo reboot
```

### FIX ISSUE MACOS _"'/box': No such file or directory"_

```plaintext
1.vim ~/Library/Group\ Containers/group.com.docker/settings.json
2.append "deprecatedCgroupv1": true
3.sudo pkill Docker
4.open /Applications/Docker.app
5.  do this with all containers related to judge0
docker restart [containerID]
```
