# leaflet
⚠️ Stock Caddy error pages, free for anyone to use if kept credits.

## Usage
To use the error page, first pull this repository to your server.

For example, the command below pulls the repository to `/var/www`:
```
git clone https://github.com/ltgcgo/leaflet.git /var/www
```

Then you can just place symlinks named `errors`, which then point to `/var/www/stock/errors`.

Finally, add this snippet to your existing Caddy configuration:
```
(errHandler) {
	handle_errors {
		rewrite * /errors/global.htm
		file_server
		templates
	}
}
```

You can also serve blocked page to blocked clients:
```
(errHandler) {
	@blockedClients {
		protocol http
		remote_ip 106.0.0.0/10 106.64.0.0/11
	}
	handle @blockedClients {
		rewrite * /errors/global.htm
		file_server
		templates
	}
}
```

Reload your Caddy server, and you are all set!

## To-do
- [x] Neat page design
- [x] Theme support
- [x] Dark mode
- [x] Mild color mode
- [ ] Manually switch to dark mode
- [ ] Automatic dark mode
- [ ] Manual mild color mode
- [ ] Do not use JavaScript to load error messages
- [ ] Fully static, only loads CSSs, SVGs and fonts.
