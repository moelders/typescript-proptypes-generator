import path from 'path';
import fse from 'fs-extra'
import generate from '../src';

describe('generate', () => {
	test('creates a proptype output from an interface', async () => {
		const fseWriteSpy = jest.spyOn(fse, 'writeFile').mockImplementation(() => Promise.resolve());
		await generate({
			tsConfig: path.resolve(__dirname, '../tsconfig.json'),
			prettierConfig: path.resolve(__dirname, '../.prettierrc'),
			inputDir: path.resolve(__dirname, './fixtures'),
		})
		expect(fseWriteSpy.mock.calls).toMatchSnapshot();
	})
});
