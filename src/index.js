import query from './query-hashnode.js';
import { list, blog } from './display.js';
import { startGroup, info, endGroup, error as _error, setFailed } from '@actions/core';
import { readFileSync, writeFileSync } from "fs";
import commitFile from './commit-file.js';
import { GistBox } from 'gist-box';

// 🛠 Retrieve configuration inputs
export function getConfig() {
	return {
		TYPE: process.env.TYPE?.toLowerCase() || "",
		FILE: process.env.FILE || "",
		STYLE: process.env.STYLE?.toLowerCase() || "",
		COUNT: process.env.COUNT || "5",
		BLOG_URL: process.env.BLOG_URL?.toLowerCase() || "",
		GITHUB_WORKSPACE: process.env.GITHUB_WORKSPACE || "",
		GITHUB_TOKEN: process.env.GITHUB_TOKEN || "",
	};
}

// 🛠 Log parsed configuration
export function logConfig(config) {
	startGroup('Parsed Config');
	info(`Type                     = ${config.TYPE}`);
	info(`File / Gist ID           = ${config.FILE}`);
	info(`Hashnode Blog URL        = ${config.BLOG_URL}`);
	info(`Output Style             = ${config.STYLE}`);
	info(`No Of Posts To Display   = ${config.COUNT}`);
	endGroup();
}

// 🛠 Fetch latest posts
export async function fetchPosts(blogUrl, count) {
	const results = await query(blogUrl, count);
	startGroup('Latest Posts');
	info(JSON.stringify(results, null, 2));
	endGroup();
	return results;
}

// 🛠 Generate output based on style
export function generateOutput(posts, style) {
	if (style.startsWith('list')) return list(posts, style);
	if (style.startsWith('blog')) return blog(posts, style);
	return '';
}

// 🛠 Handle updating Gist
export async function updateGist(config, posts) {
	const output = generateOutput(posts, config.STYLE);
	const listData = await list(posts, 'list-gist');

	const box = new GistBox({ id: config.FILE, token: config.GITHUB_TOKEN });

	await box.update({
		filename: 'blog.md',
		description: 'My Latest Blogs 👇',
		content: listData + '\n\n' + output
	});
}

// 🛠 Handle updating a local file
export async function updateFile(config, posts) {
	const filePath = `${config.GITHUB_WORKSPACE}/${config.FILE}`;
	const fileContent = readFileSync(filePath, 'utf-8');
	const output = generateOutput(posts, config.STYLE);

	const regex = /^(<!--(?:\s|)HASHNODE_BLOG:(?:START|start)(?:\s|)-->)(?:\n|)([\s\S]*?)(?:\n|)(<!--(?:\s|)HASHNODE_BLOG:(?:END|end)(?:\s|)-->)$/gm;
	const updatedContent = fileContent.replace(regex, `$1\n${output}\n$3`);

	writeFileSync(filePath, updatedContent);

	await commitFile().catch(err => {
		_error(err);
		info(err.stack);
		process.exit(err.code || -1);
	});
}

// 🏁 Main execution function
export async function run(config) {
	try {
		logConfig(config);
		const posts = await fetchPosts(config.BLOG_URL, config.COUNT);

		if (config.TYPE === 'gist') {
			await updateGist(config, posts);
		} else {
			await updateFile(config, posts);
		}
	} catch (error) {
		setFailed(error.message);
	}
}

// 🏁 Execute only when run directly
if (import.meta.url === `file://${process.argv[1]}`) {
	run(getConfig());
}
