const fs = require('fs');
const path = require('path');

function processMDX(sourceDir, destAppDir) {
  if (!fs.existsSync(sourceDir)) return;
  const files = fs.readdirSync(sourceDir);
  for (const file of files) {
    if (file.endsWith('.mdx')) {
      const slug = file.replace('.mdx', '');
      const content = fs.readFileSync(path.join(sourceDir, file), 'utf-8');
      
      const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      if (match) {
        const yaml = match[1];
        const body = match[2];
        const titleMatch = yaml.match(/title:\s*"(.*?)"/);
        const dateMatch = yaml.match(/date:\s*"(.*?)"/);
        const title = titleMatch ? titleMatch[1] : slug;
        const date = dateMatch ? dateMatch[1] : '';

        const newContent = `export const frontmatter = {
  title: "${title}",
  date: "${date}"
};

export const metadata = {
  title: "${title} | Spool",
  description: "Read about ${title} on the Spool blog.",
};

# ${title}
*${date}*

${body}
`;
        
        const folderPath = path.join(process.cwd(), destAppDir, slug);
        if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
        fs.writeFileSync(path.join(folderPath, 'page.mdx'), newContent);
      }
    }
  }
}

processMDX(path.join(process.cwd(), 'content', 'blog'), path.join('src', 'app', 'blog'));
processMDX(path.join(process.cwd(), 'content', 'compare'), path.join('src', 'app', 'compare'));

console.log('Processed MDX files to Next.js native pages!');
