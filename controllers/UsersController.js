const User = require('../models/User');

module.exports.viewUsers = (req, res) => {
    return User.find({}).lean();
};

module.exports.createUser = (req, res) => {
    const user = new User(req.body);
    user.save((error) => {
        if (error) {
            let obj_errors = {};
            let phone_errors = {phone: 'Error phone.'};
            for (key in error.errors)
                obj_errors[key] = error.errors[key].properties.message;

            return res.status(422).send(!obj_errors.length ? phone_errors : obj_errors);
        }

        return res.status(200).json({id: user._id})
    });
};

module.exports.loginUser = async (req, res) => {
    if (req.phone && req.password) {
        let user = await User.findOne({$and: [{phone: req.phone}, {password: req.password}]});
        if (user) {
            user.token = Math.random().toString(36).substr(2, 10);
            await user.save();
            return await res.status(200).json({token: user.token});
        } else {
            return res.status(404).json({login: "Incorrect login or password"});
        }
    } else {
        let errorForm = {};

        if (!req.phone)
            errorForm.phone = 'Path `phone` is required.';

        if (!req.password)
            errorForm.password = 'Path `password` is required.';

        return res.status(422).json(errorForm)
    }
};

let getToken = (token) => {
    let tokenAuthorization = token ? token.split(" ")[1] : ' ';
    let user = User.findOne({token: tokenAuthorization});
    return user
};

module.exports.logoutUser = async (req, res) => {
    let user = await getToken(req.header('Authorization'));

    if(user !== null){
        user.token = '-1';
        await user.save();
        return res.status(200).send('')
    }else{
        return res.status(403).json({message: "You need authorization"})
    }
};
