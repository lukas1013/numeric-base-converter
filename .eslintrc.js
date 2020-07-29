module.exports = {
    "env": {
    	  "browser": true,
        "commonjs": true,
        "es2020": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended"
    ],
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        //"ecmaVersion": 2020,
        "sourceType": "module",
    },
    "plugins": [
        "react", //eslint-plugin-react
        "react-hooks" 
    ],
    "rules": {
    	"react/prop-types": "off",
    	"no-unused-vars": 1 //warn
    },
    "settings": {
    	"react": {
    		"version": "detect"
    	}
    }
};
