export function isEmpty(values: string[]) {
    let errors: { message: string; }[] = [];
  
    values.forEach(value => {
      if(!value || value.trim() === '') {
        errors.push({
          message: `${value} is required`
        })
      }
    });
  
    return errors;
  }