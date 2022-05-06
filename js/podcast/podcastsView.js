export const limiTitle = (title, limit =17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split('').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur)
            }
            return acc + cur.length;
        }, 0);

        //return the result
        return `${newTitle.join('')}...`;
    }

    return title;
}