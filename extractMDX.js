import fs from 'fs';
import path from 'path';

const content = fs.readFileSync(path.join(process.cwd(), 'src', 'views', 'BlogPost.js'), 'utf-8');

// Quick and dirty extraction
const objectStringMatch = content.match(/const blogContent = (\{[\s\S]*?\});\s*const BlogPost/);

if (objectStringMatch) {
  let objectString = objectStringMatch[1];
  // Since it's raw JS, we can just evaluate it
  const evalFunc = new Function('return ' + objectString);
  const blogContent = evalFunc();
  
  const contentDir = path.join(process.cwd(), 'content');
  if (!fs.existsSync(contentDir)) fs.mkdirSync(contentDir);
  
  const blogDir = path.join(contentDir, 'blog');
  if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir);
  
  const compareDir = path.join(contentDir, 'compare');
  if (!fs.existsSync(compareDir)) fs.mkdirSync(compareDir);

  for (const [slug, data] of Object.entries(blogContent)) {
    const isCompare = slug.startsWith('spool-vs-');
    const targetDir = isCompare ? compareDir : blogDir;
    
    // Create MDX frontmatter and content
    const mdxContent = `---
title: "${data.title.replace(/"/g, '\\"')}"
date: "${data.date}"
readTime: "${data.readTime}"
category: "${data.category}"
---

${data.content}
`;
    
    fs.writeFileSync(path.join(targetDir, `${slug}.mdx`), mdxContent);
  }
  console.log("Successfully extracted MDX files.");
} else {
  console.log("Failed to match object.");
}
