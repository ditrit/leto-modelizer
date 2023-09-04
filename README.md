# Leto Modelizer (leto-modelizer)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer&metric=alert_status)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer&metric=reliability_rating)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer&metric=sqale_rating)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer&metric=security_rating)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer)

[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer&metric=code_smells)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer&metric=bugs)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer&metric=vulnerabilities)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer&metric=sqale_index)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer)

[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer&metric=ncloc)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer&metric=coverage)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer&metric=duplicated_lines_density)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer)

[![](https://dcbadge.vercel.app/api/server/zkKfj9gj2C?style=flat&theme=default-inverted)](https://discord.gg/zkKfj9gj2C)


Technical topology low-code editing tool.

Leto modelizer is an application that can help you generate infrastructure code without you having to write any code!
One of theirs main qualities is that you can choose:


- which languages you can provide with this application

Or

- Implements your own plugin

Or

- Override existing plugins

If your company take care only of terraform files, you just have to install terraform before build this app and deploy it.

If you only want your own language component (maybe based on existing plugins), you can implement/override existing plugin and just install your plugin definition.

## Requirements

* node - [v18.4](https://nodejs.org/en/blog/release/v18.4.0)
* npm - [v8.19.3](https://www.npmjs.com/package/npm/v/8.19.3)

## Official plugins

For now, we don't have many plugins to offer you, but follow us and in the next (few) months you will see new plugins (like Jenkins or Kubernetes).

### Terraform plugin

Plugin to manage terraform files, by default it comes with aws provider definition.

[GitHub url](https://github.com/ditrit/terrator-plugin#0.6.0)

### Github plugin

Plugin to manage github action files.

[GitHub url](https://github.com/ditrit/githubator-plugin#0.2.4)

## Compatibility versions table

<table>
  <thead>
    <tr>
      <th rowspan="2">Leto-modelizer</th>
      <th colspan="3">Supported version</th>
    </tr>
    <tr>
      <th>Plugin-core</th>
      <th>Terrator-plugin</th>
      <th>Githubator-plugin</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1.0.0</td>
      <td>= 0.13.0<br>= 0.14.0</br></td>
      <td>= 0.1.12</td>
      <td>🚫</td>
    </tr>
    <tr>
      <td>1.1.0</td>
      <td>= 0.15.2</td>
      <td>= 0.2.0</td>
      <td>= 0.1.1</td>
    </tr>
    <tr>
      <td>1.2.0</td>
      <td>= 0.16.0</td>
      <td>= 0.3.0</td>
      <td>= 0.2.0</td>
    </tr>
    <tr>
      <td>Next</td>
      <td>= 0.20.0</td>
      <td>= 0.6.0</td>
      <td>= 0.2.4</td>
    </tr>
  </tbody>
</table>

## How to install plugin

Run `npm install` to let npm retrieve all dependencies and especially our cli to easily install your plugins 😉.

Then you just have to know two things about your plugins:
- it's name
- it's repository url

To install plugin, run this command `npm run plugin:install`.
You can choose between installing __official__ or __custom__ plugins.

### Install official plugins

The `leto-modelizer-plugin-cli.json` file, at the root of Leto Modelizer, contains the list of official plugins provided by the team. Each plugin is represented by an object containing the name, repository URL and version of the plugin.

Choose __Official plugins__ to select from the list of official plugins, one or more plugin(s) to install.

![](docs/plugin-install-official.gif)

### Install custom plugin

Choose __Custom plugin__ to install a specific plugin not referenced as an official plugin.

![](docs/plugin-install-custom.gif)

Examples with official plugins:
- terrator-plugin: 
  - plugin name: `terrator-plugin`
  - git repository url: `https://github.com/ditrit/terrator-plugin.git#0.6.0`
- githubator-plugin: 
  - plugin name: `githubator-plugin`
  - git repository url: `https://github.com/ditrit/githubator-plugin.git#0.2.4`

### Install custom plugin in command line

Options `repository-name` and `repository-url` can be added with the `npm run plugin:install` command to bypass cli prompts.

```bash
# Example with terraform plugin
npm run plugin:install -- repository-name="terrator-plugin" repository-url="https://github.com/ditrit/terrator-plugin.git#0.6.0"

# Example with github action plugin
npm run plugin:install -- repository-name="githubator-plugin" repository-url="https://github.com/ditrit/githubator-plugin.git#0.2.4"
```

Now that your plugin is installed, you can continue to install other plugins with the same command if you want.

### Initialize plugins


When you have installed all the desired plugins, please run this commands `npm run plugin:init` to complete all plugins' installation.

![](docs/plugin-init.png)


## How to setup the authentication with OIDC

We use OIDC authentication with [oidc-client-ts](https://github.com/authts/oidc-client-ts) library. To do so, you must fill the configuration related to the provider of your choice inside `global.config.json` root file. You can declare one or more provider for the user to log in.
Example with `Google` and `Github` providers.

```json
{
  "authentication": {
    "OIDC": [
      {
        "name": "Github",
        "icon": "github.svg",
        "userMapping": {
          "firstname": "profile.firstname",
          "lastname": "profile.lastname",
          "email": "profile.email",
          "id": "profile.id"
        },
        "config": {...}
      },
      {
        "name": "Google",
        "icon": "google.svg",
        "userMapping": {...},
        "config": {...}
      }
    ]
  }
}
```

- the `name` is the name of the provider. It is required.
- the `icon` is the icon of the provider. It is required, must be named `/[OIDC[x].name]/i.svg` and be placed inside `public/provider` folder.
- the `userMapping` is the map between needed user parameters and where to find them. It is required.

The `config` object might change from one provider to another. Here is an example configuration for `Github` provider:

```json
{
  "authentication": {
    "OIDC": [
      {
        "name": "Github",
        "icon": "provider/github.svg",
        "userMapping": {
          "firstname": "profile.firstname",
          "lastname": "profile.lastname",
          "email": "profile.email",
          "id": "profile.id"
        },
        "config": {
          "authority": "https://token.actions.githubusercontent.com",
          "automatic_silent_renew": true,
          "client_id": "your-client-id",
          "client_secret": "your-client-secret",
          "redirect_uri": "https://your-app.com/redirect",
          "response_type": "code",
          "scope": "openid profile email",
          "silent_redirect_uri": "https://your-app.com/silent-refresh",
          "metadata": {
            "authorization_endpoint": "https://github.com/login/oauth/authorize",
            "token_endpoint": "https://github.com/login/oauth/access_token/"
          }
        }
      }
    ]
  }
}
```

Here's a description of each key in the provided configuration:

  `authority`: The URL of the OIDC provider's authority. It represents the base URL of the provider's authentication server.

  `automatic_silent_renew`: A boolean value indicating whether to automatically renew the user's access token silently in the background when it expires.

  `client_id`: The client identifier assigned by the OIDC provider for your application. It is used to identify your application when making authentication requests.

  `client_secret`: The client secret assigned by the OIDC provider for your application. It is used to authenticate your application when exchanging the authorization code for an access token.

  `redirect_uri`: The URI where the OIDC provider will redirect the user after successful authentication. It should be a URL within your application where you can handle the authentication response.

  `response_type`: The type of response expected from the OIDC provider. In this case, it is set to 'code', indicating that the authorization code flow will be used for authentication.

  `scope`: The requested scopes for the authentication process. Scopes define the access rights and information that your application requests from the user.

  `silent_redirect_uri`: The URI where the OIDC provider will redirect to perform silent token renewals. It should be a URL within your application.

  `metadata`: Additional metadata related to the OIDC provider configuration. It includes properties like authorization_endpoint, token_endpoint, and others.

  `authorization_endpoint`: URL of the OP's OAuth 2.0 Authorization Endpoint.

  `token_endpoint`: The URL of the OIDC provider's token endpoint. It is used to exchange the authorization code for an access token.

:warning: Don't forget to update `nginx.conf` with a reverse proxy for your authentication provider.

## How to build this app

### Native build

Once you have installed and initialized all your plugins, run this command to build the app:

```
npm run build
```

It will generate the built application in the `dist` folder.

### Docker build

To build this app with docker, please use this command:
```bash
docker build . --build-arg proxy_url=http://localhost:9999 -t leto-modelizer
```

### Proxy

See [nginx configuration](nginx.conf).

### Environment variables

* Using templates from a remote repository

`TEMPLATE_LIBRARY_BASE_URL` is used to define the url of a template library you want to use. To have more information on how to build your own template library, please visit [leto-modelizer-templates-library](https://github.com/ditrit/leto-modelizer-templates-library). To define `TEMPLATE_LIBRARY_BASE_URL`, go to your repository, open the `index.json` file (which contains all the metadata of your templates) in raw mode and get the url to the branch name, without including the file name.


```bash
# Example with the leto-modelizer-templates-library repository that contains all default templates for leto-modelizer.
TEMPLATE_LIBRARY_BASE_URL="https://raw.githubusercontent.com/ditrit/leto-modelizer-templates-library/main" npm run build
```

To be able to access external resources for your templates, you need to set a reverse proxy named `template-library`. You can see an example below of an `nginx.conf` file:

```bash
http {
  server {
    listen 80;
    location /template-library {
      proxy_pass TEMPLATE_LIBRARY_BASE_URL; # replace by your url
    }
  }
}
```

**_NOTE:_**  You can use the global configuration file `global.config.json` to define `TEMPLATE_LIBRARY_BASE_URL` environment variable like so :

```json
{
  "templateLibrary": "YOUR_TEMPLATE_LIBRARY_BASE_URL",
  "authentication": {
    "OIDC": [{ /* config */ }]
  }
}
```

* Allow to keep `data-cy` attribute in html

`KEEP_CYPRESS_ATTRIBUTE` is used to keep all `data-cy` attribute in the generated html.

```bash
KEEP_CYPRESS_ATTRIBUTE=true npm run build
```
