---
title: 影院
date: 2022-08-10 18:55:04
update: 2022-09-01 21:00:00
background: url(https://data-static.netdun.net/Fomalhaut/img/movie.webp)
comments: false
---
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>折叠菜单示例</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .menu {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }
        .menu > li {
            margin-bottom: 10px;
        }
        .menu > li > a {
            text-decoration: none;
            color: #000;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: bold;
        }
        .menu .submenu {
            display: none;
            list-style-type: none;
            padding-left: 20px;
        }
        .menu .submenu li {
            margin-bottom: 5px;
        }
        .menu .submenu li a {
            text-decoration: none;
            color: #007bff;
        }
        .menu .submenu-toggle {
            cursor: pointer;
        }
    </style>
</head>
<body>

<ul class="menu" id="menu">
    <!-- 菜单项将在此动态生成 -->
</ul>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        // 使用正确的路径加载JSON数据
        fetch('static_data/links.json')
            .then(response => {
                response.json();
                console.log(response.json())});
            .then(data => {
                const menu = document.getElementById('menu');

                data.forEach(item => {
                    const listItem = document.createElement('li');
                    const folderLink = document.createElement('a');
                    folderLink.textContent = item.folder;
                    folderLink.classList.add('submenu-toggle');

                    const submenu = document.createElement('ul');
                    submenu.classList.add('submenu');

                    item.links.forEach(link => {
                        const subItem = document.createElement('li');
                        const subLink = document.createElement('a');
                        subLink.href = link.permalink;
                        subLink.textContent = link.title;
                        subLink.target = '_blank';
                        subItem.appendChild(subLink);
                        submenu.appendChild(subItem);
                    });

                    listItem.appendChild(folderLink);
                    listItem.appendChild(submenu);
                    menu.appendChild(listItem);

                    folderLink.addEventListener('click', function() {
                        submenu.style.display = submenu.style.display === 'none' ? 'block' : 'none';
                    });
                });
            })
            .catch(error => console.error('Error loading links:', error));
    });
</script>

</body>
</html>

