const Prompts = artifacts.require('Prompts');

contract('Prompts', (accounts) => {
  let prompts;
  beforeEach(async () => {
    prompts = await Prompts.new();
  });

  // Check if the contract is initialized correctly.
  it('Should have correct initial values', async () => {
    let counter = await prompts.counter();
    assert.equal(counter, 0, "counter is not 0!");
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
    await prompts.mintPrompt("Comment1", 1);
    let ramifications1 = await prompts.promptRamifications(1);
    await prompts.mintPrompt("Comment2", 1);
    let ramifications2 = await prompts.promptRamifications(1);

    let counter2 = await prompts.counter();
    assert.equal(ramifications0, 0, "ramifications0 is not 0!");
    assert.equal(ramifications1, 1, "ramifications1 is not 1!");
    assert.equal(ramifications2, 2, "ramifications2 is not 2!");
  });

  // Checks if promptOrder getter is working properly.
  it('Should get promptOrder successfully', async () => {
    await prompts.mintPrompt("Prompt1");
    let comm0 = await prompts.promptOrder(1, 0);

    await prompts.mintPrompt("Comment1", 1);
    let comm1 = await prompts.promptOrder(1, 1); //Should pass test
    //let comm1 = await prompts.promptCommentById(1, 2); //Should fail test

    await prompts.mintPrompt("Comment2", 1);
    let comm2 = await prompts.promptOrder(1, 2);

    assert.equal(comm0, "Prompt1", "comm0 is not 'Prompt1'!");
    assert.equal(comm1, "Comment1", "comm1 is not 'Comment1'!");
    assert.equal(comm2, "Comment2", "comm2 is not 'Comment2'!");
  });
});