const group = (array, subGroupLength) => {
         let index = 0;
         let newArray = [];
         while(index < array.length) {
             newArray.push(array.slice(index, index += subGroupLength));
         };
         return newArray;
     }

     export default group;