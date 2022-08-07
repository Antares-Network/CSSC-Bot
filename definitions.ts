type dict = {
	[key: string]: string;
};

function returnRoles(): dict[] {
	let studentRoleDictionary = {
		Prefrosh: String(process.env.prefrosh),
		Freshman: String(process.env.freshman),
		Sophomore: String(process.env.sophomore),
		Junior: String(process.env.junior),
		Senior: String(process.env.senior),
		Graduatestudent: String(process.env.Graduatestudent),
		Alumni: String(process.env.alumni),
	};
	let staffRoleDictionary = {
		Tutor: String(process.env.tutor),
		Sileader: String(process.env.sileader),
		Ta: String(process.env.ta),
		Studentemployee: String(process.env.Studentemployee),
		Professor: String(process.env.Professor)
	}
	if (process.env.debugMode === "true") {
		
		let studentRoleDictionary = {
			Prefrosh: "1003849993255403601",
			Freshman: "1003367383181824131",
			Sophomore: "1003367410679685262",
			Junior: "1003367473053171743",
			Senior: "1003850030920245409",
			Graduatestudent: "1003850131994583122",
			Alumni: "1003850162935975960"
		};
		let staffRoleDictionary = {
			Tutor: "1003850195202744560",
			Sileader: "1003850241591742595",
			Ta: "1003850228643934260",
			Studentemployee: "1003850274840002620",
			Professor: "1003881218686865439"
		}
		return [studentRoleDictionary, staffRoleDictionary];
	};
	return [studentRoleDictionary, staffRoleDictionary];
}

export { returnRoles };
