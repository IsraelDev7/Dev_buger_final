import bcrypt from 'bcrypt';

async function test() {
  try {
    const hash = await bcrypt.hash('123456', 8);
    console.log('Bcrypt Hash Success:', hash);
    const match = await bcrypt.match('123456', hash);
    console.log('Bcrypt Match Success:', match);
  } catch (err) {
    console.error('Bcrypt Error detected:', err.message);
  }
}

test();
