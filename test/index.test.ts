import fse from 'fs-extra'
import generate from '../src';

describe('generate', () => {
	let fseWriteSpy: jest.SpyInstance;

	beforeEach(() => {
		fseWriteSpy = jest.spyOn(fse, 'outputFile').mockImplementation(() => Promise.resolve());
	})

	afterEach(() => {
		fseWriteSpy.mockRestore();
	})

	test('creates a proptype output from an interface input file', async () => {
		await generate({
			tsConfig: 'tsconfig.json',
			prettierConfig: '.prettierrc',
			inputPattern: './test/fixtures/interface.ts',
		})
		expect(fseWriteSpy.mock.calls[0][1]).toMatchSnapshot();
	})

	test('creates a proptype output from a type input file', async () => {
		await generate({
			tsConfig: 'tsconfig.json',
			prettierConfig: '.prettierrc',
			inputPattern: './test/fixtures/type.ts',
		})
		expect(fseWriteSpy.mock.calls[0][1]).toMatchSnapshot();
	})

	test('creates a proptype output from an input pattern', async () => {
		await generate({
			tsConfig: 'tsconfig.json',
			prettierConfig: '.prettierrc',
			inputPattern: './test/fixtures/*.ts',
		})
		expect(fseWriteSpy.mock.calls[0][1]).toMatchSnapshot();
	})

	test('creates a proptype output from a nested input pattern', async () => {
		await generate({
			tsConfig: 'tsconfig.json',
			prettierConfig: '.prettierrc',
			inputPattern: './test/fixtures/**/*.ts',
		})
		expect(fseWriteSpy.mock.calls[0][1]).toMatchSnapshot();
	})

	test('places output in provided outputPath', async () => {
		await generate({
			tsConfig: 'tsconfig.json',
			prettierConfig: '.prettierrc',
			inputPattern: './test/fixtures/interface.ts',
			outputDir: 'generated-prop-types'
		})
		expect(fseWriteSpy.mock.calls[0][1]).toMatchSnapshot();
	})

	test('places output in provided outputPath keeping directories from baseDir', async () => {
		await generate({
			tsConfig: 'tsconfig.json',
			prettierConfig: '.prettierrc',
			inputPattern: './test/fixtures/*.ts',
			outputDir: 'generated-prop-types',
			baseDir: 'test/'
		})

		expect(fseWriteSpy.mock.calls[1][0]).toMatch(/\/generated-prop-types\/fixtures\/\w+\.js/);
	})
});
