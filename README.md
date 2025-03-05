<p align="center">
    <a href="https://hashnode.com/">
        <img src="https://cdn.svarun.dev/common/hashnode/icon.png" width="150px"/>
    </a>
</p>

<h1 align="center">Hashnode Blogs - <i>GitHub Action</i></h1>
<p align="center">~ Fetch & Display Your Latest Blog Posts From <a href="https://hashnode.com/"><strong>Hashnode</strong></a> ~</p>

## ⚙️ Configuration
| Option | Description | Default |
| :---: | :---: | :---: |
| `TYPE` | Set this to `gist` if you want to display the latest posts in a pinned Gist | `gist` |
| `FILE` | Provide a file path or a **Gist ID** if `TYPE` is set to `gist` | `README.md` |
| `BLOG_URL` | Your Hashnode blog URL (e.g., `myblog.hashnode.dev` or `mycustomdomain.com`) | Required |
| `STYLE` | Options: `list`, `list-ordered`, `blog`, `blog-right`, `blog-left`, `blog-alternate`, `blog-grid-2`, `blog-grid-3` | `list` |
| `COUNT` | Number of latest posts to display | `6` |

---
### Please check the [Demo Repository](https://github.com/varunsridharan/demo-action-hashnode-blog) to preview all possible **Styles**
---

## 🚀 Usage

### 💾  In Repository File
#### 1. Add the following content to your `README.md` (or any other file where you want to showcase posts)
```markdown
## My Latest Blog Posts 👇
<!-- HASHNODE_BLOG:START -->
<!-- HASHNODE_BLOG:END -->
```
#### 2. Configure the Workflow
<!-- START RAW -->
```yaml
name: "📚 Blog Updater"

on:
  workflow_dispatch:
  schedule:
    - cron: '0 0 * * *' # Runs Every Day

jobs:
  update_blogs:
    name: "Update Blogs"
    runs-on: ubuntu-latest
    steps:
      - name: "📥 Fetching Repository Contents"
        uses: actions/checkout@main

      - name: "📚 Hashnode Updater"
        uses: "varunsridharan/action-hashnode-blog@main"
        with:
          BLOG_URL: 'your-blog-url' # Your Hashnode Blog URL
          COUNT: 10 # Max number of posts to display
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
<!-- END RAW -->

### 📌  In Pinned Gists
1. Create a new **public** GitHub Gist (https://gist.github.com/)
2. Create a GitHub token with the `gist` scope.
3. [Create a secret](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets) 🔑 in your repository with:
    - **Name:** `GIST_TOKEN`
    - **Value:** Your GitHub token with `gist` permissions.

<!-- START RAW -->
```yaml
name: "📚 Blog Updater"

on:
  workflow_dispatch:
  schedule:
    - cron: '0 0 * * *' # Runs Every Day

jobs:
  update_blogs:
    name: "Update Blogs"
    runs-on: ubuntu-latest
    steps:
      - name: "📚 Hashnode Updater"
        uses: "varunsridharan/action-hashnode-blog@main"
        with:
          COUNT: 5 # Number of posts to display
          FILE: "your-gist-id" # Gist ID
          TYPE: "gist"
        env:
          GITHUB_TOKEN: ${{ secrets.GIST_TOKEN }} # Personal Access Token with Gist scope
```
<!-- END RAW -->

---

## 📝 Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

[Checkout CHANGELOG.md](https://github.com/varunsridharan/action-hashnode-blog/blob/main/CHANGELOG.md)


## 🤝 Contributing
If you would like to help, please take a look at the list of [issues](https://github.com/varunsridharan/action-hashnode-blog/issues/).


## 📜 License & Conduct
- [**MIT License**](https://github.com/varunsridharan/action-hashnode-blog/blob/main/LICENSE) © [Varun Sridharan](website)
- [Code of Conduct](https://github.com/varunsridharan/.github/blob/main/CODE_OF_CONDUCT.md)


## 📣 Feedback
- ⭐ Star this repository if this project helped you! :wink:
- Create an [🔧 Issue](https://github.com/varunsridharan/action-hashnode-blog/issues/) if you need help or found a bug.


## 💰 Sponsor
[I][twitter] fell in love with open-source in 2013 and haven't looked back since!  
If you, or your company, use any of my projects or like what I’m doing, kindly consider backing me. I'm in this for the long run.

- ☕ Support open-source work by [buying me a coffee][buymeacoffee] for just **$9.99**.
- 🚀 Love open-source tools? Consider [sponsoring an hour of development][paypal] for **$49.99**.

<!-- Personal Links -->
[paypal]: https://sva.onl/paypal
[buymeacoffee]: https://sva.onl/buymeacoffee
[twitter]: https://sva.onl/twitter/
[website]: https://sva.onl/website/


## Connect & Say 👋
- **Follow** me on [👨‍💻 GitHub][github] to stay updated on free and open-source software.
- **Follow** me on [🐦 Twitter][twitter] for the latest updates.
- **Message** me on [📠 Telegram][telegram].

<!-- Personal Links -->
[github]: https://sva.onl/github/
[telegram]: https://sva.onl/telegram/

---

<p align="center">
<i>Built with ❤️ by <a href="https://sva.onl/twitter" target="_blank" rel="noopener noreferrer">Varun Sridharan</a></i><br/>
   <img src="https://cdn.svarun.dev/codeispoetry.png"/>
</p>