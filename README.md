# Portfólio

Site pessoal com os meus projetos, cada um com uma demonstração interativa usando dados fictícios.
Feito só com HTML, CSS e JavaScript: não tem framework, não tem etapa de build e não precisa de servidor.

## Editar o conteúdo

Tudo o que aparece no site fica em **`js/conteudo.js`**. É o único arquivo que você precisa editar.

1. Procure por `[COMPLETAR` e troque pelos seus dados: LinkedIn, GitHub, e-mail, WhatsApp e detalhes da formação.
   Enquanto um campo continuar com `[COMPLETAR`, ele simplesmente não aparece no site. Os botões de GitHub e LinkedIn, no início e no contato, só aparecem depois de preenchidos.
2. **Foto:** coloque o arquivo em `assets/` (por exemplo, `assets/foto.jpg`) e preencha `pessoa.foto: "assets/foto.jpg"`.
   Enquanto não houver foto, o site mostra as suas iniciais.
3. **WhatsApp:** preencha o número com DDI e DDD (por exemplo, `"55 11 98888-7777"`). Lembre que ele fica público.
4. **Trajetória:** a linha do tempo fica em `sobre.linhaDoTempo`, do item mais antigo para o mais recente.
5. **Novo projeto:** copie um item da lista `projetos` e troque os textos.
   - Se ele não tiver demonstração, use `demo: null`.
   - O link do repositório vai em `github`. Se ficar vazio, o botão não aparece.
   - A demonstração interativa aparece ao vivo na vitrine de projetos. Se o projeto **não** tiver demo, você pode mostrar uma imagem em `imagem` (por exemplo, `assets/projetos/meu-projeto.webp`). Sem demo e sem imagem, aparece só o texto.
   - Nunca use print do sistema real com dados da empresa.

## Ver no computador

```
python -m http.server 8080
```

Depois é só abrir http://localhost:8080. O site não abre clicando direto no `index.html`, porque usa módulos JavaScript que precisam de um servidor.

## Testes

```
npm test
```

Usa o test runner que já vem no Node, sem instalar nada.

## Publicar no GitHub Pages

1. Crie um repositório **público** no GitHub (por exemplo, `seu-usuario.github.io` para o site ficar na raiz).
2. No terminal:
   ```
   git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
   git push -u origin main
   ```
3. No GitHub, vá em **Settings → Pages → Build and deployment**, escolha *Deploy from a branch*, depois *main* e */ (root)*.
4. Quando o endereço estiver no ar, troque `SEU-USUARIO` em `og:url` e `og:image` no `index.html` (marcados com `ATUALIZE`) pelo endereço real. É isso que faz a prévia do link aparecer bonita no LinkedIn e no WhatsApp.
   - Os endereços precisam ser **completos**, começando com `https://`.
   - Se o repositório não se chamar `seu-usuario.github.io`, o endereço inclui o nome dele. Exemplo: `https://seu-usuario.github.io/portfolio/assets/og.png`.

As pastas `docs/` e `.superpowers/` são só de planejamento local e não vão para o GitHub.
