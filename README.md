# url elongator

> the opposite of a url shortener.

paste a url, get a longer one back. choose how long. that's it.

**live site:** [thisisajokeabouturlshortnersitsnowlonginsteadofshortlolzplshelp.com](https://thisisajokeabouturlshortnersitsnowlonginsteadofshortlolzplshelp.com)

## how it works

the original url is base64-encoded and embedded in the hash of the elongated url. when someone visits the elongated url, the page decodes the hash and redirects automatically, no server required.

## length options

| option | noise characters added |
|---|---|
| short | 0 (just the encoded url) |
| medium | 16 |
| long | 128 |
| loooooong | 512 (default) |
| very loooooong | 1024 |
| longest | 2048 |
| very longest | 4096 |
| loooooongest | 8192 |

## deployment

purely static, deploy directly via github pages from the repo root.
