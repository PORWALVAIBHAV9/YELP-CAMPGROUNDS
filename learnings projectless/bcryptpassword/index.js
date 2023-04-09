const bcrypt = require('bcrypt');




const hashedpassword = async (psd)=>//psd is the text password come from form 
{
    const salt = await bcrypt.genSalt(1) //this mumber is the number of round it takes to generate salt inshort more the number more the time to generate the password
    console.log(salt);
    const hashpass = await bcrypt.hash(psd, salt)
    console.log(hashpass)
}

hashedpassword('monkey');

const checkpassword = async (psd, hashpsd)=>{
    const result = await bcrypt.compare(psd, hashpsd)
    console.log(result)
    if (result){
        console.log("Succesfullt logged in ")
    }else {
        console.log('Incorrect')
    }

}


checkpassword('monkey', '$2b$04$sIrxXDTyapg9lgJLulgZ/u/RZUsT0H7O6sdEUxFlnS7ysbr.9cjIG')