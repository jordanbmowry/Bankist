'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jordan Mowry',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2021-02-11T14:11:59.604Z',
    '2021-02-12T17:01:17.194Z',
    '2021-02-13T23:36:17.929Z',
    '2021-02-15T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Functions

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    /*
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
    */
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}<div>
          <div class="movements__value">${formattedMov}</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(function (mov) {
      return mov < 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .map(function (deposit) {
      return (deposit * acc.interestRate) / 100;
    })
    .filter(function (int, i, arr) {
      // console.log(arr);
      return int >= 1;
    })
    .reduce(function (acc, int) {
      return acc + int;
    }, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);
  //Display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // In each call, print the remaining time to the UI
    labelTimer.textContent = `${min} : ${sec}`;

    // When the time is at 0, stop timer and logout the user}, 1000);
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    // Decrease 1 sec
    time--;
  };
  // Set time to 5 mins
  let time = 120;
  // call the timer every sec
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};
// Event handlers
let currentAccount, timer;

// Fake Always Logged In
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

//Experimenting with the API

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(function (acc) {
    return acc.username === inputLoginUsername.value;
  });
  console.log(currentAccount);
  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };

    // const locale = navigator.language;
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    // Clear input fields
    /*
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = `${now.getFullYear()}`;
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
    */
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (timer) clearInterval(timer);

    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    const index = accounts.findIndex(function (acc) {
      return acc.username === currentAccount.username;
    });
    console.log(index);
    // Delete Account
    accounts.splice(index, 1);
    // Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movements
      currentAccount.movements.push(amount);
      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());
      // Update UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(function (acc) {
    return acc.username === inputTransferTo.value;
  });
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/*
let arr = ['a', 'b', 'c', 'd', 'e'];

// Slice
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
console.log(arr.slice());
console.log([...arr]);

// Splice
// console.log(arr.splice(2));
// takes off the last element
arr.splice(-1);
console.log(arr);

// Reverse
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

// Concat
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

// Join
console.log(letters.join(' - '));
*/
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements)
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1} You withdrew ${Math.abs(movement)}`);
  }
}

console.log('-----------------');
movements.forEach(function (mov, i, arr) {
  if (mov > 0) {
    console.log(`Movement ${i + 1}: You deposited ${mov}`);
  } else {
    console.log(`Movement ${i + 1} You withdrew ${Math.abs(mov)}`);
  }
});
*/
//Map
/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

//Set
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);

console.log(currenciesUnique);
currenciesUnique.forEach(function (value, _, set) {
  console.log(`${value}: ${_} ${set}`);
});
*/

/*
const eurToUsd = 1.1;

const movementsUsd = movements.map(mov => mov * eurToUsd);

console.log(movements);
console.log(movementsUsd);

const movementsUSDfor = [];
for (const mov of movements) movementsUSDfor.push(mov * eurToUsd);
console.log(movementsUSDfor);

const movementsDescription = movements.map(
  (mov, i) =>
    `Movement ${i + 1}:${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`
);
console.log(movementsDescription);
*/
/*
const deposits = movements.filter(function (mov) {
  return mov > 0;
});

console.log(movements);
console.log(deposits);

const depositsFor = [];
for (const mov of movements) {
  if (mov > 0) depositsFor.push(mov);
}
console.log(depositsFor);

const withdrawals = movements.filter(mov => mov < 0);

console.log(withdrawals);
*/

// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration ${i}: ${acc}`);
//   return acc + cur;
// }, 0);

/*
let balance2 = 0;
for (const mov of movements) balance2 += mov;
console.log(balance2);

const balance = movements.reduce((acc, cur) => acc + cur, 0);

console.log(balance);
*/

// Max Value

/*
const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);

console.log(max);
*/
/*
const data1 = [5, 2, 4, 1, 15, 8, 3];
const data2 = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = function (dogAges) {
  const dogAgeInHumanYears = dogAges.map(function (dogAge) {
    if (dogAge <= 2) {
      return 2 * dogAge;
    } else {
      return 16 + dogAge * 4;
    }
  });

  const adultDogs = dogAgeInHumanYears.filter(function (dogAge) {
    return dogAge >= 18;
  });

  const adultDogsAverage =
    adultDogs.reduce(function (acc, curr) {
      return acc + curr;
    }, 0) / adultDogs.length;
  return adultDogsAverage;
};

const avg1 = calcAverageHumanAge(data1);
const avg2 = calcAverageHumanAge(data2);

console.log(avg1, avg2);

const eurToUsd = 1.1;
console.log(movements);
*/
// PIPELINE
/*
const totalDepositsUSD = movements
  .filter(function (mov) {
    return mov > 0;
  })
  // .map(function (mov) {
  //   return mov * eurToUsd;
  // })
  .map(function (mov, i, arr) {
    // console.log(arr);
    return mov * eurToUsd;
  })
  .reduce(function (acc, mov) {
    return acc + mov;
  }, 0);

console.log(totalDepositsUSD);
*/
const data1 = [5, 2, 4, 1, 15, 8, 3];
const data2 = [16, 6, 10, 5, 6, 1, 4];
/*
const calcAverageHumanAge = function (dogAges) {
  const dogAgeInHumanYears = dogAges.map(function (dogAge) {
    if (dogAge <= 2) {
      return 2 * dogAge;
    } else {
      return 16 + dogAge * 4;
    }
  });

  const adultDogs = dogAgeInHumanYears.filter(function (dogAge) {
    return dogAge >= 18;
  });

  const adultDogsAverage =
    adultDogs.reduce(function (acc, curr) {
      return acc + curr;
    }, 0) / adultDogs.length;
  return adultDogsAverage;
};
*/
/*
const calcAverageHumanAge = dogAges =>
  dogAges
    .map(dogAge => (dogAges <= 2 ? 2 * dogAge : 16 + dogAge * 4))
    .filter(dogAge => dogAge >= 18)
    .reduce((acc, dogAge, i, arr) => acc + dogAge / arr.length, 0);

const data1Average = calcAverageHumanAge(data1);
const data2Average = calcAverageHumanAge(data2);

console.log(data1Average, data2Average);
*/
/*
const firstWithdrawal = movements.find(function (mov) {
  return mov < 0;
});
console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find(function (acc) {
  return acc.owner === 'Jessica Davis';
});

console.log(account);

for (const acc of accounts) {
  if (acc.owner === 'Jessica Davis') {
    const accoun2 = acc.owner;
  }
}
console.log(account2);
*/
/*
// Equality
console.log(movements);
console.log(movements.includes(-130));

// SOME: Condition
console.log(
  movements.some(function (mov) {
    return mov === -130;
  })
);

const anyDeposits = movements.some(function (mov) {
  return mov > 1500;
});
console.log(anyDeposits);

// Every
console.log(
  movements.every(function (mov) {
    return mov > 0;
  })
);

console.log(
  account4.movements.every(function (mov) {
    return mov > 0;
  })
);

// Separate callback
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));
*/
/*

const arr = [[1, 2, , 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], , 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

const accountMovements = accounts.map(function (acc) {
  return acc.movements;
});

const allMovements = accountMovements.flat();

const overalBalance = allMovements.reduce(function (acc, curr) {
  return acc + curr;
}, 0);
*/
//flat
/*
const accountMovements = accounts
  .map(function (acc) {
    return acc.movements;
  })
  .flat()
  .reduce(function (acc, curr) {
    return acc + curr;
  }, 0);

console.log(accountMovements);
//flatMap
const accountMovements2 = accounts
  .flatMap(function (acc) {
    return acc.movements;
  })
  .reduce(function (acc, curr) {
    return acc + curr;
  }, 0);
*/
/*
//Strings
const owners = ['Jordan', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());

// Numbers
console.log(movements);

// return < 0 a, b (keep order)
// return > 0, b, a (switch order)
movements.sort(function (a, b) {
  return a - b;
});
console.log(movements);
*/
/*
//empty arrays + fill method
const arr1 = [1, 2, 3, 4, 5, 6, 7];
const x = new Array(7);
console.log(x);
// console.log(x.map(() => 5));
// x.fill(1);
x.fill(1, 3, 5);
x.fill(1);
console.log(x);

arr1.fill(23, 2, 6);
console.log(arr1);

// Array.from
const y = Array.from({ length: 7 }, function () {
  return 1;
});
console.log(y);

const z = Array.from({ length: 7 }, function (_, i) {
  return i + 1;
});
console.log(z);

const movementsUI = Array.from(document.querySelectorAll('.movements__value'));
console.log(movementsUI);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);
});


// 1
const bankDepositSum = accounts
  .flatMap(function (acc) {
    return acc.movements;
  })
  .filter(function (acc) {
    return acc > 0;
  })
  .reduce(function (sum, cur) {
    return sum + cur;
  }, 0);
console.log(bankDepositSum);
*/
// 2
// const numDeposits1000 = accounts
//   .flatMap(function (acc) {
//     return acc.movements;
//   })
//   .filter(function (mov) {
//     return mov >= 1000;
//   }).length;
/*
const numDeposits1000 = accounts
  .flatMap(function (acc) {
    return acc.movements;
  })
  .reduce(function (count, cur) {
    return cur >= 1000 ? ++count : count;
  }, 0);
console.log(numDeposits1000);

let a = 10;
console.log(++a);

// 3
const { deposits, withdrawals } = accounts
  .flatMap(function (acc) {
    return acc.movements;
  })
  .reduce(
    function (sums, cur) {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      // return sums;
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );

console.log(deposits, withdrawals);

//4
const convertTitleCase = function (title) {
  const capitalize = function (str) {
    return str[0].toUpperCase() + str.slice(1);
  };
  const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(function (word) {
      return exceptions.includes(word) ? word : capitalize(word);
    })
    .join(' ');
  return capitalize(titleCase);
};

console.log(convertTitleCase(`this is a nice title`));
console.log(convertTitleCase(`this is a LONG title but not too long`));
console.log(convertTitleCase(`and here is another title with an EXAMPLE`));
*/
/*
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];
//1
dogs.forEach(function (dog) {
  const recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
  dog.recommendedFood = recommendedFood;
});

// 2
const dogSarah = dogs.find(function (dog) {
  return dog.owners.includes('Sarah');
});
console.log(dogSarah);
console.log(
  `Sarah's dog is eating too ${
    dogSarah.curFood > dogSarah.recommendedFood ? 'much' : 'little'
  }`
);

// 3
const ownersEatTooMuch = dogs
  .filter(function (dog) {
    return dog.curFood > dog.recommendedFood;
  })
  .flatMap(function (dog) {
    return dog.owners;
  });
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(function (dog) {
    return dog.curFood < dog.recommendedFood;
  })
  .flatMap(function (dog) {
    return dog.owners;
  });

console.log(ownersEatTooLittle);

//4
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);

// 5
console.log(
  dogs.some(function (dog) {
    return dog.curFood === dog.recommendedFood;
  })
);

const checkEatingOkay = function (dog) {
  return (
    dog.curFood > dog.recommendedFood * 0.9 &&
    dog.curFood < dog.recommendedFood * 1.1
  );
};

// 6
console.log(dogs.some(checkEatingOkay));

// 7
console.log(dogs.filter(checkEatingOkay));

// 8
const dogsSorted = dogs.slice().sort(function (a, b) {
  return a.recommendedFood - b.recommendedFood;
});
console.log(dogsSorted);
*/
/*
console.log(23 === 23.0);

console.log(0.1 + 0.2);
console.log(0.1 + 0.2 === 0.3);

// Convert strings to numbers
console.log(Number('23'));
console.log(+'23');

// Parsing
console.log(Number.parseInt('30px', 10));
console.log(Number.parseInt('e23', 10));

console.log(Number.parseInt('2.5rem'));
console.log(Number.parseFloat('2.5rem'));

// console.log(parseFloat('   2.5rem'));

console.log(Number.isNaN('20'));
console.log(Number.isNaN(+'20X'));
console.log(Number.isNaN(23 / 0));

//Best way of checking if a value is a number
console.log(Number.isFinite(23));
console.log(Number.isFinite('23'));
console.log(Number.isFinite(+'23X'));
console.log(Number.isFinite(23 / 0));
*/
/*
console.log(Math.sqrt(25));
console.log(8 ** (1 / 3));
console.log(Math.max(5, 18, '23', 11, 2));
console.log(Math.max(5, 18, '23px', 11, 2));

console.log(Math.min(5, 18, '23', 11, 2));

console.log(Math.PI * Number.parseFloat('10px') ** 2);

console.log(Math.trunc(Math.random() * 6) + 1);

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;
console.log(randomInt(10, 20));

// rounding ints
console.log(Math.trunc(23.3));
console.log(Math.round(23.9));

console.log(Math.ceil(23.3));
console.log(Math.ceil(23.9));

console.log(Math.floor(23.3));
console.log(Math.floor('23.9'));

console.log(Math.floor('-23.9'));
console.log(Math.trunc('-23.9'));

// Rounding decimals
console.log((2.7).toFixed(0));
console.log((2.7).toFixed(3));
console.log(+(2.345).toFixed(2));
*/
/*
console.log(5 % 2);
console.log(5 / 2); //5 = 2 * 2 + 1

console.log(8 % 3);
console.log(8 / 3); //8 = 2 * 3 + 2

console.log(7 % 2);
console.log(7 / 2);

const isEven = n => n % 2 === 0;
console.log(isEven(8));
console.log(isEven(23));
console.log(isEven(514));

labelBalance.addEventListener('click', function (e) {
  e.preventDefault();
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';
    if (i % 3 === 0) row.style.backgroundColor = 'blue';
  });
});
*/
/*
console.log(
  2 ** 53 - 1
);
console.log(Number.MAX_SAFE_INTEGER);
console.log(2 ** 53 + 1);
console.log(2 ** 53 + 2);
console.log(2 ** 53 + 3);
console.log(2 ** 53 + 4);
console.log(2 ** 53 + 5);

console.log(9999965464766546565465465465545665654n);
console.log(BigInt(9999965464766546565465465465545665654));

// Operations
console.log(10000n + 10000n);
console.log(10n * 20n);

const huge = 13216546498798432132321n;
const num = 23;
console.log(huge * BigInt(num));

// Exceptions
console.log(20n > 15);
console.log(20n === 20);
console.log(typeof 20n);
console.log(20n == 20);

console.log(huge + ' is REALLY big!');

// Divisions
console.log(11n / 3n);
console.log(10 / 3);
*/
/*
// Create a date
const now = new Date();
console.log(now);
console.log(new Date('Mon Feb 15 2021 06:36:04'));
console.log(new Date('December 24, 2015'));
console.log(new Date(account1.movementsDates[0]));
console.log(new Date(2037, 10, 19, 15, 23, 5));
console.log(new Date(2037, 10, 33));

console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 60 * 100));
*/
// Working with dates
/*
const future = new Date(2037, 10, 19, 15, 23);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getDay());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.toISOString());
console.log(future.getTime());

console.log(new Date(2142282180000));

console.log(Date.now());

future.setFullYear(2040);
console.log(future);
*/
/*
const future = new Date(2037, 10, 19, 15, 23);
console.log(Number(future));
console.log(+future);

const calcDaysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

const days1 = calcDaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 4));

console.log(days1);
*/
/*
const num = 3884764.23;

const options = {
  style: 'currency',
  unit: 'celsius',
  currency: 'EUR',
};

console.log('US: ', new Intl.NumberFormat('en-US', options).format(num));
console.log('Germany: ', new Intl.NumberFormat('de-DE', options).format(num));
console.log('Syria: ', new Intl.NumberFormat('ar-SY', options).format(num));
console.log(
  navigator.language,
  new Intl.NumberFormat(navigator.language, options).format(num)
);
*/
// setTimeout
/*
const ingredients = ['olives', 'spinach'];
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}🍕`),
  3000,
  ...ingredients
);
console.log('Waiting...');

if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

// SetInterval
setInterval(function () {
  const now = new Date();
  const hours = now.getHours();
  const mins = now.getMinutes();
  const seconds = now.getSeconds();
  console.log(hours, mins, seconds);
}, 1000);
*/
