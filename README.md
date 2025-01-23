# fluent-svelte-extra

A fork of fluent-svelte which is in active development.

# Undocumented Components

Components that we develop won't be in docs. But you can view the detailed usage [here](https://github.com/OpenAnime/fluent-svelte-extra/blob/main/src/routes/test/index.svelte)

# Switching between themes

Along with the new components, we have also added the ability to switch between dark and light themes. To switch between themes you should import `fluent-svelte-extra/switchable.css` in your +layout.svelte file and add `fds-theme-dark` or `fds-theme-light` classes to your `<html>` tag in app.html file. `fluent-svelte-extra/switchable.css` does not contain anything that can be controlled by `prefers-color-scheme`

If you use `fluent-svelte-extra/theme.css` it will use the system default until you add `fds-theme-dark` or `fds-theme-light` classes to your `<html>` tag.

Based on your needs, you can select a file which will be the best fit for your project.

# Note

Thanks to the [creator](https://github.com/Tropix126) of [fluent-svelte](https://github.com/tropix126/fluent-svelte) library for making such an awesome library!