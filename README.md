# Convertei — Conversor de Arquivos Online

SaaS profissional de conversão de arquivos online, com **processamento local no navegador** sempre que possível.

**Converta seus arquivos online, de forma rápida, simples e segura.**

---

## O que o Convertei REALMENTE converte

Abaixo está a lista **honesta** de tudo que funciona no projeto atual.  
Só aparece o que tem motor real implementado.

### 1. Imagens (motor: Canvas nativo do navegador)

| Entrada     | Saídas possíveis                  | Qualidade |
|-------------|-----------------------------------|-----------|
| JPG / JPEG  | PNG, WEBP, BMP, GIF, ICO          | Excelente |
| PNG         | JPG, WEBP, BMP, GIF, ICO          | Excelente |
| WEBP        | JPG, PNG, BMP, GIF                | Excelente |
| GIF         | JPG, PNG, WEBP, BMP               | Boa       |
| BMP         | JPG, PNG, WEBP, GIF               | Excelente |
| ICO         | PNG, JPG                          | Boa       |
| SVG         | PNG, JPG, WEBP                    | Boa       |
| **HEIC / HEIF** | JPG, PNG, WEBP                 | Boa       |
| **HEIC / HEIF** | JPG, PNG, WEBP                 | Boa       |

**Opções disponíveis:** qualidade, redimensionar, girar (90/180/270°), espelhar.  
**HEIC** usa a biblioteca heic2any (carregada sob demanda).

---

### 2. Áudio (motor: FFmpeg WebAssembly – carregado sob demanda)

| Entrada | Saídas possíveis              |
|---------|-------------------------------|
| MP3     | WAV, OGG, AAC, FLAC, M4A      |
| WAV     | MP3, OGG, AAC, FLAC, M4A      |
| OGG     | MP3, WAV, AAC, FLAC           |
| AAC     | MP3, WAV, OGG, FLAC           |
| FLAC    | MP3, WAV, OGG, AAC            |
| M4A     | MP3, WAV, OGG, AAC            |
| OPUS    | MP3, WAV, OGG                 |

**Opções:** bitrate, sample rate, mono/stereo.

---

### 3. Vídeo (motor: FFmpeg WebAssembly – carregado sob demanda)

| Entrada | Saídas possíveis                     |
|---------|--------------------------------------|
| MP4     | WEBM, MKV, AVI, MOV, MP3, WAV, GIF   |
| WEBM    | MP4, MKV, AVI, MP3, WAV              |
| MKV     | MP4, WEBM, AVI, MOV, MP3             |
| AVI     | MP4, WEBM, MKV, MOV                  |
| MOV     | MP4, WEBM, MKV, AVI                  |
| MPEG/MPG| MP4, WEBM, MKV                       |
| FLV     | MP4, WEBM                            |
| WMV     | MP4, WEBM                            |
| M4V     | MP4, WEBM                            |
| 3GP     | MP4, WEBM                            |
| TS      | MP4, WEBM, MKV                       |
| VOB     | MP4, WEBM, MKV                       |
| OGV     | MP4, WEBM                            |

**Opções:** resolução, codec, FPS, bitrate, remover áudio, etc.

---

### 4. Arquivos / Compactação (motor: JSZip)

| Entrada         | Saída           | Função     |
|-----------------|-----------------|------------|
| Vários arquivos | ZIP             | Compactar  |
| ZIP             | Arquivos soltos | Extrair    |

---

### 5. Documentos (suporte atual)

| Entrada     | Saídas reais | Observação                |
|-------------|--------------|---------------------------|
| PDF         | JPG, PNG     | Renderização de páginas   |
| TXT         | PDF          | Suporte básico            |
| HTML        | TXT, PDF     | Suporte básico            |
| CSV         | TXT          | Suporte básico            |
| **DOC**     | —            | **Não suportado**         |
| **DOCX**    | —            | **Não suportado**         |
| ODT, RTF, XLS, XLSX | —   | **Não suportado**         |

> **Importante:** DOC e DOCX **não** são convertidos neste projeto.  
> Para conversão profissional de documentos (DOCX → PDF etc.) o ideal é uma SaaS separada.

---

## Resumo rápido – O que funciona bem

| Categoria      | Status         | Qualidade   |
|----------------|----------------|-------------|
| Imagens (+ HEIC)| Completo      | Excelente   |
| Áudio          | Completo       | Muito boa   |
| Vídeo          | Completo       | Muito boa   |
| ZIP            | Completo       | Excelente   |
| PDF → Imagem   | Parcial        | Boa         |
| TXT/HTML → PDF | Básico         | Aceitável   |
| DOC / DOCX     | **Não existe** | —           |

---

## Como usar o projeto

### 1. Instalação

```bash
cd convertei
npm install
```

### 2. Rodar em desenvolvimento

```bash
npm run dev
```

Abre automaticamente em: **http://localhost:3000**

### 3. Build para produção

```bash
npm run build
```

Gera a pasta `dist/` pronta para publicar.

### 4. Preview do build

```bash
npm run preview
```

### 5. Deploy na Netlify

**Forma mais fácil:**
1. Rode `npm run build`
2. Entre em [app.netlify.com](https://app.netlify.com)
3. Arraste a pasta **`dist`**

**Ou via Git:**
1. Suba o projeto no GitHub
2. Na Netlify → Import project
3. Build command: `npm run build`
4. Publish directory: `dist`

O arquivo `netlify.toml` já está configurado corretamente.

---

## Como converter um arquivo (uso do site)

1. Abra o site
2. Arraste o arquivo ou clique em **Selecionar arquivos**
3. Escolha o formato de saída
4. Clique em **Converter**
5. Baixe o resultado

Você pode selecionar vários arquivos e converter em lote.  
No final dá para baixar tudo em um único ZIP.

---

## Tecnologias usadas

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router
- JSZip (arquivos ZIP)
- FFmpeg.wasm (áudio e vídeo – carregado sob demanda)
- Canvas API nativo (imagens)
- vite-plugin-pwa (Progressive Web App)

---

## Limitações honestas

- Arquivos muito grandes de vídeo/áudio dependem da memória do dispositivo do usuário
- Conversão de documentos complexos (DOCX, ODT etc.) **não está implementada**
- FFmpeg é carregado apenas quando o usuário inicia uma conversão de mídia
- Processamento prioritariamente local (privacidade)

---

## Estrutura do projeto

```
convertei/
├── src/
│   ├── components/     # Interface (Header, Dropzone, FileCard...)
│   ├── pages/          # Páginas do site
│   ├── converters/     # Motores reais de conversão
│   ├── services/       # ConversionEngine (orquestração)
│   ├── config/         # Matriz de formatos suportados
│   ├── hooks/
│   └── utils/
├── public/             # Ícones e favicon
├── netlify.toml
└── package.json
```

---

**Convertei** — Conversão real, sem mentira.
