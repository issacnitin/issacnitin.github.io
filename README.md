# BlogEngine

The source for [issacnitin.github.io](https://issacnitin.github.io/).

The site features a responsive writing index, individual article pages, and
an `/about` page. Post cards derive their titles, dates, summaries, and reading
times from the HTML files in `public/posts`; `postorder` controls their order.
The design uses system fonts, with no external font-loading request.

## Local development

Install the dependencies and start the development server:

```sh
npm ci
npm start
```

## GitHub Pages

Pushes to `master` are built and deployed by the
`Deploy to GitHub Pages` workflow. Each post has a stable URL such as
`/blog/computing_power`, and the build includes a `404.html` fallback so
client-side routes work when opened directly.

In the repository's **Settings > Pages** screen, the **Source** is configured
as **GitHub Actions**.

## Container deployment on dellr630

The site also runs in a dedicated Ubuntu 24.04 KVM guest on
`issacnitin@dellr6301.tail303f77.ts.net`. This does not change the GitHub Pages
deployment.

| Resource | Value |
| --- | --- |
| VM, libvirt network, and storage pool | `issacnitin-site` |
| Resources | 2 vCPUs, 2 GiB RAM, 16 GiB disk |
| Guest address | `172.29.244.10` (DHCP reservation) |
| NAT subnet | `172.29.244.0/24` |
| Application directory | `/opt/issacnitin-site` |
| Origin URL inside the guest | `http://127.0.0.1:8080` |

The VM, network, Docker daemon, and container start automatically after reboot.
The container runs as an unprivileged user with a read-only filesystem and a
writable temporary directory. Nginx serves static assets and falls back to
`index.html` for client-side routes, including direct `/blog/<slug>` visits.
Missing `/posts/` and `/static/` resources return 404 rather than HTML.

The build stage uses Node 16 to match the existing legacy GitHub Pages build;
it is end-of-life and should be upgraded with the frontend toolchain separately.
Node and build dependencies are not included in the running Nginx image.
The image overrides `PUBLIC_URL` to `/` so assets and routing work on a custom
hostname without changing the GitHub Pages configuration.

### Connect and preview

On the Mac used for deployment, the dedicated SSH key, verified guest host key,
and SSH configuration are stored under `~/.ssh/issacnitin-site*`. Keep the private
key secure and back it up or add your own public key to the guest before removing
these files. Tailscale connectivity to the hypervisor is required.

```sh
ssh -F ~/.ssh/issacnitin-site.conf issacnitin-site
```

For a local preview, run this on the Mac and keep it open:

```sh
ssh -F ~/.ssh/issacnitin-site.conf -N \
  -L 18080:127.0.0.1:8080 issacnitin-site
```

Then open `http://localhost:18080`. Port 8080 is deliberately not exposed on
the guest's network interface.

### Deploy updates

From the repository root on the Mac:

```sh
tar --no-xattrs --disable-copyfile -czf /tmp/issacnitin-site-source.tgz \
  Dockerfile compose.yaml .dockerignore .npmrc package.json package-lock.json \
  tsconfig.json tsconfig.prod.json tsconfig.test.json tslint.json images.d.ts \
  deploymentstuff/nginx.conf src public
scp -F ~/.ssh/issacnitin-site.conf /tmp/issacnitin-site-source.tgz \
  issacnitin-site:/opt/issacnitin-site/source.tgz
ssh -F ~/.ssh/issacnitin-site.conf issacnitin-site \
  'cd /opt/issacnitin-site && tar -xzf source.tgz && rm source.tgz && sudo docker compose up -d --build --wait'
rm /tmp/issacnitin-site-source.tgz
```

Inside the guest, inspect the service with:

```sh
cd /opt/issacnitin-site
sudo docker compose ps
sudo docker compose logs --tail=100 site
curl -fsS http://127.0.0.1:8080/healthz
```

To build elsewhere with Docker Compose, run `docker compose up -d --build --wait`
from this repository's root. The same loopback-only origin URL applies.

### Configure Cloudflare

No Cloudflare account, tunnel, or public DNS record has been changed by this
deployment. `cloudflared` is already installed **inside the guest** from
Cloudflare's signed apt repository. Use a remotely managed Cloudflare Tunnel;
no router port forwarding, public IP, or inbound port 80/443 is needed.

1. Add a domain you own to Cloudflare and activate its nameservers at your
   registrar. You cannot configure Cloudflare DNS for `issacnitin.github.io`;
   use your own domain or subdomain.
2. In the Cloudflare dashboard, open **Networking > Tunnels**, create a tunnel
   named `issacnitin-site`, and select Linux/Debian, amd64. In older Zero Trust
   layouts this is under **Networks > Connectors > Cloudflare Tunnels**.
3. SSH into the guest using the command above. Run the dashboard's
   `sudo cloudflared service install <TUNNEL_TOKEN>` command there. Do not run
   it on the hypervisor or your Mac. Treat the token as a secret: do not commit
   it or paste it into chat. To avoid saving it in shell history, prefix that
   command with a space in Ubuntu's default Bash shell.
4. Wait for the tunnel to become **Healthy**. On its **Routes** tab select
   **Add route > Published application**, choose your domain and optional
   subdomain, leave the path blank, and set **Service URL** to
   `http://127.0.0.1:8080` (type **HTTP**, not HTTPS). Save the route.
   The dashboard creates the tunnel DNS record. If that hostname already has
   an A, AAAA, or CNAME record, confirm the intended cutover before replacing it;
   do not point DNS at the guest's private IP or the Tailscale host.
5. Enable **Always Use HTTPS** for the public hostname. Browser-facing TLS
   terminates at Cloudflare; the tunnel transport is encrypted and the final
   HTTP hop is confined to guest loopback. Do not enable a blanket "Cache
   Everything" rule: HTML, service worker files, and posts must revalidate.
6. Open `https://<your-hostname>/` and a direct blog URL such as
   `https://<your-hostname>/blog/computing_power`.

The public hostname remains unconfigured until you complete these steps.
Once configured, `cloudflared` runs as a system service and starts after reboot.
If the tunnel will not connect, allow **outbound** UDP/TCP port 7844 and DNS;
no inbound firewall exception is required.

```sh
sudo systemctl status cloudflared
sudo journalctl -u cloudflared --no-pager -n 100
curl -fsS http://127.0.0.1:8080/healthz
```

See Cloudflare's
[dashboard tunnel guide](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/get-started/create-remote-tunnel/)
for the current UI.
