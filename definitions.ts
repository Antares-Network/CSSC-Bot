type dict = {
	[key: string]: string;
};

function returnRoles(): dict[] {
	let studentRoleDictionary = {
		prefrosh: String(process.env.prefrosh),
		freshman: String(process.env.freshman),
		sophomore: String(process.env.sophomore),
		junior: String(process.env.junior),
		senior: String(process.env.senior),
		graduatestudent: String(process.env.graduatestudent),
		alumni: String(process.env.alumni),
	};
	let staffRoleDictionary = {
		tutor: String(process.env.tutor),
		sileader: String(process.env.sileader),
		ta: String(process.env.ta),
		studentemployee: String(process.env.studentemployee)
	}
	if (process.env.debugMode === "true") {
		
		let studentRoleDictionary = {
			prefrosh: "1003849993255403601",
			freshman: "1003367383181824131",
			sophomore: "1003367410679685262",
			junior: "1003367473053171743",
			senior: "1003850030920245409",
			graduatestudent: "1003850131994583122",
			alumni: "1003850162935975960"
		};
		let staffRoleDictionary = {
			tutor: "1003850195202744560",
			sileader: "1003850241591742595",
			ta: "1003850228643934260",
			studentemployee: "1003850274840002620",
			professor: "1003881218686865439"
		}
		return [studentRoleDictionary, staffRoleDictionary];
	};
	return [studentRoleDictionary, staffRoleDictionary];
}

export { returnRoles };
