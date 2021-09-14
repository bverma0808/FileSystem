const assert          = require('assert');
const AlohaFileSystem = require('../AlohaFileSystem')

describe( "Tests for Aloha File System", () => {
	let afs

	beforeEach(() => {
		// create a new File System object
		afs = new AlohaFileSystem()
	});

	it("Test 1: Running 'ls' in empty directory should return empty array []", () => {
		let actual = afs.ls()
		assert.deepStrictEqual(actual, [], 'It should have been empty')
	});
	
	it("Test 2: Create a new dir named 'Vehicle' in current directory and 'ls' returns a list containing ['Vehicle']", () => {
		afs.mkdir('Vehicle')
		let actual = afs.ls()
		assert.deepStrictEqual(actual, ['Vehicle'], "It should have been ['Vehicle']")
	});

	it("Test 3: Create nested directories in 'root' and 'ls -r' in 'root' should return all of them", () => {
		// created nested dirs
		afs.mkdir('Vehicle')
		afs.cd('Vehicle')
		afs.mkdir('TwoWheelers')
		afs.mkdir('FourWheelers')
		afs.cd('FourWheelers')
		afs.mkdir('Ford')
		afs.mkdir('Toyota')
		afs.mkdir('Tata')
		afs.cd('Tata')
		afs.touch('suvs.csv')
		afs.touch('sedans.csv')

		// run ls cmd => while being inside 'Tata' dir
		let ls_Result = afs.ls()
		assert.deepStrictEqual(ls_Result, [ 'suvs.csv', 'sedans.csv' ])

		// also check result of pwd
		let pwd_Result = afs.pwd()
		assert.strictEqual(pwd_Result, '//Vehicle/FourWheelers/Tata')

		// go one level up inside 'FourWheelers' now
		afs.cd('..')
		ls_Result = afs.ls('r')
		assert.deepStrictEqual(ls_Result, [
			'Ford',
			'Toyota',
			'Tata',
			'  suvs.csv',      // Notice the indentation used in front of nested object names
			'  sedans.csv'
		])

		// also check result of pwd
		pwd_Result = afs.pwd()
		assert.strictEqual(pwd_Result, '//Vehicle/FourWheelers')

		// go one level up inside 'Vehicle' now
		afs.cd('..')
        ls_Result = afs.ls('r')
		assert.deepStrictEqual(ls_Result, [
			'TwoWheelers',
			'FourWheelers',
			'  Ford',         // Notice the indentation used in front of nested object names
			'  Toyota',
			'  Tata',
			'    suvs.csv',   // Notice the indentation used in front of nested object names
			'    sedans.csv'
		])

		// also check result of pwd
		pwd_Result = afs.pwd()
		assert.strictEqual(pwd_Result, '//Vehicle')

		// go one level up inside 'root' now
		afs.cd('..')
        ls_Result = afs.ls('r')
		assert.deepStrictEqual(ls_Result, [
			'Vehicle',
			'  TwoWheelers',
			'  FourWheelers',
			'    Ford',
			'    Toyota',
			'    Tata',
			'      suvs.csv',
			'      sedans.csv'
		])

		// also check result of pwd
		pwd_Result = afs.pwd()
		assert.strictEqual(pwd_Result, '/')

		// try to go one level up, but since, root is the topmost level in hierarchy, we will stay inside 'root' only
		afs.cd('..')
		ls_Result = afs.ls()
		assert.deepStrictEqual(ls_Result, ['Vehicle'])
	});

	it("Test 4: Try creating a duplicate directory under a given directory should not create a new directory", () => {
		let mkdir_Result = afs.mkdir('Vehicle')
		assert.strictEqual(mkdir_Result, true)

		// Again try creating the dir with same name
		mkdir_Result = afs.mkdir('Vehicle')
		assert.strictEqual(mkdir_Result, false, 'Should not create a duplicate directory/file') //should be false now
	})

	it("Test 5: Try 'cd' to a non-existing dir and it should return false", () => {
		let cd_Result = afs.cd('RandomDir')
		assert.strictEqual(cd_Result, false)
	})

	it("Test 6: Try creating a new dir in a non-existing dir and it should return false", () => {
		let mkdir_Result = afs.mkdir('RandomDir/anotherRandomdir')
		assert.strictEqual(mkdir_Result, false)

		mkdir_Result = afs.mkdir('Vehicle')
		assert.strictEqual(mkdir_Result, true)

		mkdir_Result = afs.mkdir('Vehicle/FourWheelers')
		assert.strictEqual(mkdir_Result, true)

		mkdir_Result = afs.mkdir('Vehicle/FourWheelers/Ford')
		assert.strictEqual(mkdir_Result, true)

		let cd_Result = afs.cd('Vehicle/FourWheelers/Ford')
		assert.strictEqual(cd_Result, true)

		let pwd_Result = afs.pwd()
		assert.strictEqual(pwd_Result, '//Vehicle/FourWheelers/Ford')
	})
});