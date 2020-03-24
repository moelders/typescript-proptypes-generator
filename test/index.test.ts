import path from 'path';
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
		expect(fseWriteSpy.mock.calls).toMatchSnapshot();
	})

	test('creates a proptype output from a type input file', async () => {
		await generate({
			tsConfig: 'tsconfig.json',
			prettierConfig: '.prettierrc',
			inputPattern: './test/fixtures/type.ts',
		})
		expect(fseWriteSpy.mock.calls).toMatchSnapshot();
	})

	test('creates a proptype output from an input pattern', async () => {
		await generate({
			tsConfig: 'tsconfig.json',
			prettierConfig: '.prettierrc',
			inputPattern: './test/fixtures/*.ts',
		})
		expect(fseWriteSpy.mock.calls).toMatchSnapshot();
	})

	test('creates a proptype output from a nested input pattern', async () => {
		await generate({
			tsConfig: 'tsconfig.json',
			prettierConfig: '.prettierrc',
			inputPattern: './test/fixtures/**/*.ts',
		})
		expect(fseWriteSpy.mock.calls).toMatchSnapshot();
	})


	test('places output in provided outputPath', async () => {
		await generate({
			tsConfig: 'tsconfig.json',
			prettierConfig: '.prettierrc',
			inputPattern: './test/fixtures/interface.ts',
			outputDir: 'generated-prop-types'
		})
		expect(fseWriteSpy.mock.calls).toMatchSnapshot();
	})
});
