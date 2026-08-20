# Meu currículo — Luiz Francisco Pucci Neto

Site pessoal. Atuo em TI de Negócios na Klabin, no processo Plan to Produce (SAP), e curso
Engenharia de Software na Unicesumar (5º período).

**Site:** https://luizfp0908.github.io/MeuCurriculo/

## Arquivos

| Arquivo | O que é |
| --- | --- |
| `index.html` | Página principal: apresentação, projetos, certificados e contato |
| `Projeto_LuizCurriculo.html` | Currículo em uma página, pronto para salvar em PDF |
| `Projeto_Luiz.css` | Estilos do site |
| `Projeto_luiz.JS` | Menu, marcação da seção ativa e revelação ao rolar |
| `img/` | Foto, logos e PDFs dos certificados |

Sem framework e sem build: HTML, CSS e JavaScript puros. As únicas requisições externas
são as fontes do Google Fonts.

## Rodar localmente

Basta abrir o `index.html` no navegador. Para servir por HTTP:

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Publicar no GitHub Pages

1. No repositório, vá em **Settings → Pages**.
2. Em **Source**, escolha **Deploy from a branch**.
3. Selecione a branch `main` e a pasta `/ (root)`. Salve.
4. Em um ou dois minutos o site fica no ar no endereço acima.

## Pendências

- [ ] Ajustar o mês de início na Klabin no currículo (hoje está só "2026 — atual")
- [ ] Trocar o link do projeto "Algoritmo de compatibilidade" pelo repositório correto
- [ ] Subir o PDF do certificado do Fisk em `img/Certificado/`
- [ ] Renomear a foto de perfil para `img/perfil.jpg` (o nome atual tem espaços)
