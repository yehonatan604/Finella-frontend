const capitalizeFirstLetter = (str: string): string => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const fixPriceString = (price: string): string => {
    return price.toString().split("").filter((char) => char !== "-").join("");
}

export { capitalizeFirstLetter, fixPriceString }