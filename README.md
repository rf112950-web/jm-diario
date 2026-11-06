# JM Diário

Aplicação inicial para administrar diários/eventos Brawl Stars.

## Variáveis de ambiente na Vercel

Em Project Settings → Environment Variables, configure:

- `SUPABASE_URL`: URL do projeto Supabase.
- `SUPABASE_SERVICE_ROLE_KEY`: chave service_role do Supabase. É secreta; nunca colocar no navegador, no GitHub ou compartilhar.
- `ADMIN_PASSWORD`: senha forte escolhida para o painel administrativo.

Depois faça um redeploy.

## Uso

1. Acesse o domínio da Vercel para entrar no painel.
2. Crie um diário com nome, data e regras.
3. Copie o link gerado e configure como entrega automática no estoque correspondente da Ereemby.
4. Adicione os jogadores confirmados pelo painel.
5. Informe o código e a senha da sala quando for liberá-los.

## Atenção sobre a proteção do código

Nesta versão, o link do diário funciona como um link secreto: quem receber ou compartilhar esse link poderá abrir a página e ver o código quando ele for liberado. A restrição individual por comprador ainda depende de validar os dados reais do pedido enviados pela Ereemby no webhook. Não considere a proteção individual implementada até essa integração ser desenvolvida e testada.
