import { expect } from 'chai';
import * as cheerio from 'cheerio';
import { loadFixture } from './test-utils.js';
import { describe } from 'node:test';

describe('html-escape-bug', () => {
	let fixture;

	before(async () => {
		fixture = await loadFixture({
			root: './fixtures/html-escape-bug/',
		});
	});

	describe('build', () => {
		before(async () => {
			await fixture.build();
		});

		it('works', async () => {
			const html = await fixture.readFile('/index.html');
			const $ = cheerio.load(html);
			const h1 = $('h1');
			const script = $('script');

			expect(h1.text()).to.equal('Astro');
			expect(script.text()).to.equal(
				[
					'\n\t\tconst count = 6;',
					'const content = `There are `${count}` things!`;',
					'console.log(content);',
					`document.getElementById('content') = content;`,
				].join('\n\t\t') + '\n\t'
			);
		});
	});

	describe('dev', () => {
		let devServer;

		before(async () => {
			devServer = await fixture.startDevServer();
		});

		after(async () => {
			await devServer.stop();
		});

		it('works', async () => {
			const res = await fixture.fetch('/index.html');
			expect(res.status).to.equal(200);

			const html = await fixture.readFile('/index.html');
			const $ = cheerio.load(html);
			const h1 = $('h1');
			const script = $('script');

			expect(h1.text()).to.equal('Astro');
			expect(script.text()).to.equal(
				[
					'\n\t\tconst count = 6;',
					'const content = `There are `${count}` things!`;',
					'console.log(content);',
					`document.getElementById('content') = content;`,
				].join('\n\t\t') + '\n\t'
			);
		});
	});
});