export const VIEW_WIDTH = 293;
export const VIEW_HEIGHT = 520;

export const USER_ACTIONS = {
    LOGIN : "login",
    ACTIVATE_USER : "activate_user",
    REPORT_SNACK : "report_snack",
    GET_ALL_BASE_MONSTERS: "get_all_base_monsters",
    GET_ALL_STAGES_SAME_MONSTER: "get_all_stages_same_monster",
    CHOOSE_MONSTER: "choose_monster",
    GET_NUTRITIONIX_DATA: "get_nutritionix_data",
    ADD_TO_NUTRITIONIX_COUNT: "add_to_nutritionix_count"
}

export const USER_STATUSES = {
    MANAGER : 1,
    TEST_USER : 2,
    INACTIVE : 3
}

export const USER_GENDER = {
    M: 5,
    F: -161
}

export const WORKOUT_AMOUNT = [
    {range_min: 0, range_max: 0, multiplier: 1.2},
    {range_min: 1, range_max: 2, multiplier: 1.375},
    {range_min: 3, range_max: 5, multiplier: 1.55},
    {range_min: 6, range_max: 7, multiplier: 1.725},
    {range_min: 8, range_max: 1000, multiplier: 1.9},
]

export const VALIDATION_TYPES = {
    NON_ZERO_NUM : 'non_zero_num',
    ZERO_NUM : 'zero_num',
    STRING : 'string',
    GREATER_THAN : 'greater_than',
    IN_OBJECT : 'in_object'
}

export const MONSTER_TYPES = {
    YELLOW : "yellow",
    PURPLE : "purple",
    GREEN : "green",
    BLUE : "blue",
}

export const DESCBOX_TYPE = {
    GENERAL : "general",
    SUGAR_INTAKE_CALC : "sugar_intake_calc"
}