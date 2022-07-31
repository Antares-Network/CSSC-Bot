type dict = {
    [key: string]: string
}


// Not the most efficient way of doing this but it's just here for testing.
// Eventually this will be moved to an .env file to make it easier to set up in a new server
const roleDictionary: dict = 
{
	"prefrosh": "950928528562593833",
	"freshman": "950928723287371846",
	"sophomore": "950928801842470933",
	"junior": "950928919043932250",
	"senior": "950929067388063785",
	"graduatestudent": "950929245738262599",
	"alumni": "836653848218042379",
};


export { roleDictionary };

