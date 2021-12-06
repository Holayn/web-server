const blacklist = [
  4644,
  4646,
  4647,
  4648,
  4660,
  4664,
  4856,
  4816,
];

const isValidFile = (filename) => {
  const match = /IMG_(\d*)/.exec(filename);
  if (match) {
    const num = match[1];
    if (num >= 4641 && num <= 4870 && !blacklist.includes(parseInt(num))) {
      return true;
    }
  }

  const match1= /PXL_(\d*)_/.exec(filename);
  if (match1) {
    const num = match1[1];
    if (num >= 20211017 && num <= 20211018) {
      return true;
    }
  }

  return false;
}

module.exports = {
  isValidFile,
};