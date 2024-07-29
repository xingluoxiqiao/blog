const fs = require('fs');
const path = require('path');

hexo.extend.generator.register('links-json', function(locals) {
    // 目标文件夹的相对路径
    const targetFolder = '_posts/计算机基础/'; // 将此处替换为你想要生成链接的文件夹路径

    // 分组文章链接
    const groupedLinks = {};

    locals.posts.filter(post => {
        // 使用 path.posix 处理路径，确保跨平台兼容性
        const postFolder = path.posix.join('source', post.source);
        return postFolder.startsWith(path.posix.join('source', targetFolder));
    }).forEach(post => {
        // 获取子文件夹名称
        const relativePath = path.posix.relative('source', post.source);
        const parts = relativePath.split('/');
        const subFolder = parts.length > 3 ? parts[3] : '其他';

        if (!groupedLinks[subFolder]) {
            groupedLinks[subFolder] = {
                folder: subFolder,
                links: []
            };
        }

        groupedLinks[subFolder].links.push({
            title: post.title,
            path: post.path,
            permalink: post.permalink
        });
    });

    const outputDir = path.join(__dirname, '..', 'source', 'life', 'movies', 'static_data'); // 将文件生成在 `static_data` 目录中
    const outputFile = path.join(outputDir, 'links.json');

    // 确保目标目录存在
    if (!fs.existsSync(outputDir)){
        fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputFile, JSON.stringify(Object.values(groupedLinks), null, 2));
});
