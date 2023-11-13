import {USER_GENDER ,WORKOUT_AMOUNT, VALIDATION_TYPES} from './consts'

export const calcTotalSugarInGram = ({workouts, weight, height, age: years, gender, ...rest}) => {
    const prop_validation_type = [
        {name: "workouts", value: workouts, validation_type: VALIDATION_TYPES.ZERO_NUM},
        {name: "weight", value: weight, validation_type: VALIDATION_TYPES.NON_ZERO_NUM},
        {name: "height", value: height, validation_type: VALIDATION_TYPES.GREATER_THAN, value2: 120},
        {name: "years", value: years, validation_type: VALIDATION_TYPES.GREATER_THAN, value2: 18},
        {name: "gender", value: gender.toUpperCase(), validation_type: VALIDATION_TYPES.IN_OBJECT, value2: USER_GENDER},
    ]

    let invalid_fields = "";
    for (let item of prop_validation_type) {
        const validation_result = validateBasedOnFunc(item.validation_type, item.value, item.value2)
        if (!validation_result) invalid_fields+=`${item.name}, `
    }
    
    if(invalid_fields) {
        alert(`invalid fields: ${invalid_fields}`)
        return null;
    } else {
        return Math.round(calcTDEE(Number(workouts), Number(weight), Number(height), Number(years), gender.toUpperCase()) * 0.1)/4
    }
}

export const between = (x, min, max) => {
    return x >= min && x <= max;
}

export const validateBasedOnFunc = (validation_method, value, compare_to = {}) => {
    switch(validation_method) {
        case VALIDATION_TYPES.NON_ZERO_NUM:
            return !!Number(value);
        case VALIDATION_TYPES.ZERO_NUM:
            return Number(value) === 0 || validateBasedOnFunc(VALIDATION_TYPES.NON_ZERO_NUM, value);
        case VALIDATION_TYPES.STRING:
            return !!value;
        case VALIDATION_TYPES.GREATER_THAN:
            return Number(value) > Number(compare_to);
        case VALIDATION_TYPES.IN_OBJECT:
            return !!compare_to[value];
        default:
            return false;
    }
}
  
const calcBMR = (weight, height, years, gender) => {
    // Men: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
    // Women: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
    return (10 * weight) + (6.25 * height) - (5 * years) + USER_GENDER[gender];
}

const calcTDEE = (workouts, weight, height, years, gender) => {
    // Sedentary (little to no exercise + work a desk job) = BMR*1.2
    // Lightly Active (light exercise 1-3 days / week) = BMR*1.375
    // Moderately Active (moderate exercise 3-5 days / week) = BMR*1.55
    // Very Active (heavy exercise 6-7 days / week) = BMR*1.725
    // Extremely Active (strenuous training 2x / day) = BMR*1.9
    let multiplier = 0;
    for (let measurement of WORKOUT_AMOUNT) {
        if (between(workouts, measurement.range_min, measurement.range_max)) {
            multiplier = measurement.multiplier;
            break;
        }
    }
    return multiplier*calcBMR(weight, height, years, gender)
}