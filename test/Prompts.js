const Prompts = artifacts.require('Prompts');

contract('Prompts', (accounts) => {
  let prompts;
  beforeEach(async () => {
    prompts = await Prompts.new();
  });

  // Checks if mintPrompt() is working properly.
  it('Should mintPrompt() successfully', async () => {
    let counter0 = await prompts.counter();
    await prompts.mintPrompt("Prompt1");
    let counter1 = await prompts.counter();
    await prompts.mintPrompt("Comment1", 1);
    let counter2 = await prompts.counter();
    assert.equal(counter0, 0, "counter0 is not 0!");
    assert.equal(counter1, 1, "counter1 is not 1!");
    assert.equal(counter2, 2, "counter2 is not 2!");
  });

  // Checks if validOldCid() modifier is working properly.
  it('Should NOT mintPrompt() successfully (validOldCid)', async () => {
    let counter0 = await prompts.counter();
    await prompts.mintPrompt("Prompt1");
    let counter1 = await prompts.counter();
    try {
      await prompts.mintPrompt("Comment1", 2);  //Should pass test
      //await prompts.mintPrompt("Comment1", 1); //Should fail test
    } catch(err) {
      console.log(err.message);
    }

    let counter2 = await prompts.counter();
    assert.equal(counter0, 0, "counter0 is not 0!");
    assert.equal(counter1, 1, "counter1 is not 1!");
    assert.equal(counter2, 1, "counter2 is not 1!");
  });

  // Checks if promptRamifications() is working properly.
  it('Should promptRamifications() successfully', async () => {
    await prompts.mintPrompt("Prompt1");
    let ramifications0 = await prompts.promptRamifications(1);
    await prompts.mintPrompt("Ramification1", 1);
    let ramifications1 = await prompts.promptRamifications(1);
    await prompts.mintPrompt("Ramification2", 1);
    let ramifications2 = await prompts.promptRamifications(1);

    assert.equal(ramifications0, 0, "ramifications0 is not 0!");
    assert.equal(ramifications1, 1, "ramifications1 is not 1!");
    assert.equal(ramifications2, 2, "ramifications2 is not 2!");
  });

  // Checks if promptCids getter is working properly.
  it('Should get promptCids successfully', async () => {
    await prompts.mintPrompt("Prompt1");
    let prompt1 = await prompts.promptCids(1);

    await prompts.mintPrompt("Prompt2");
    let prompt2 = await prompts.promptCids(2);

    await prompts.mintPrompt("Prompt3");
    let prompt3 = await prompts.promptCids(3);

    assert.equal(prompt1, "Prompt1", "prompt1 is not 'Prompt1'!");
    assert.equal(prompt2, "Prompt2", "prompt2 is not 'Prompt2'!");
    assert.equal(prompt3, "Prompt3", "prompt3 is not 'Prompt3'!");
  });

  // Checks if ramifications() is working properly.
  it('Should return ramification successfully', async () => {
    await prompts.mintPrompt("Prompt1");
    await prompts.mintPrompt("Ramification1", 1);
    let ramifications1 = await prompts.ramifications(1, 0);
    await prompts.mintPrompt("Ramification2", 1);
    let ramifications2 = await prompts.ramifications(1, 1);

    assert.equal(ramifications1, 2, "ramifications1 is not 2!");
    assert.equal(ramifications2, 3, "ramifications2 is not 3!");
  });
});