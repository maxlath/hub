**1 - join Toolforge**
If you are not already a member of Toolforge, make a [membership request](https://toolsadmin.wikimedia.org/tools/membership/), and wait for it to be approved. Then add a [public ssh key to your account](https://toolsadmin.wikimedia.org/profile/settings/ssh-keys): you can find it at `~/.ssh/id_rsa.pub` on your machine, or, if you have a github account, you can copy/paste https://github.com/yourusername.keys).

**2 - join a tool account**
Join an existing [tool account](https://wikitech.wikimedia.org/wiki/Help:Toolforge#Tool_Accounts) or [create one](https://wikitech.wikimedia.org/wiki/Help:Toolforge#Creating_a_new_Tool_account)

**3 - login to the [bastion host](https://wikitech.wikimedia.org/wiki/Help:Terminology#Bastion_host) and become tool**
```sh
ssh login.tools.wmflabs.org
# join the tool hub
become hub
```

**4 - install the project**
Doc: [node.js web services](https://wikitech.wikimedia.org/wiki/Help:Toolforge/Web#node.js_web_services)
```sh
mkdir -p ~/www
cd ~/www
git clone https://github.com/maxlath/hub js
cd js
# Customize root to match the URL passed by Nginx
echo "module.exports = { root: '/hub' }" > config/local.js
# Running npm with webservice shell to get more recent node/npm versions
webservice --backend=kubernetes nodejs shell
npm install --production
webservice --backend=kubernetes nodejs start
```

**5 - Follow the logs**

```sh
# exit the `webservice --backend=kubernetes nodejs shell` to access `kubectl`
exit
kubectl get pods
kubectl logs <mypod>
```
