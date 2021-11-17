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

  // Checks if validNewCid() modifier is working properly.
  it('Should NOT mintPrompt() successfully (validNewCid)', async () => {
    let counter0 = await prompts.counter();
    await prompts.mintPrompt("Prompt1");
    let counter1 = await prompts.counter();

    try {
      await prompts.mintPrompt("Prompt1");  //Should pass test
      //await prompts.mintPrompt("Prompt2"); //Should fail test
    } catch(err) {
      console.log(err.message);
    }

    let counter2 = await prompts.counter();
    assert.equal(counter0, 0, "counter0 is not 0!");
    assert.equal(counter1, 1, "counter1 is not 1!");
    assert.equal(counter2, 1, "counter2 is not 1!");
  });

  // Checks if validOldCid() modifier is working properly.
  it('Should NOT mintPrompt() successfully (validOldCid)', async () => {
    let counter0 = await prompts.counter();
    await prompts.mintPrompt("Prompt1");
    let counter1 = await prompts.counter();
    try {
      await prompts.mintPrompt("Comment1", "Prompt2");  //Should pass test
      //await prompts.mintPrompt("Comment1", "Prompt1"); //Should fail test
    } catch(err) {
      console.log(err.message);
    }

    let counter2 = await prompts.counter();
    assert.equal(counter0, 0, "counter0 is not 0!");
    assert.equal(counter1, 1, "counter1 is not 1!");
    assert.equal(counter2, 1, "counter2 is not 1!");
  });

  // Checks if promptComments() is working properly.
  it('Should promptComments() successfully', async () => {
    await prompts.mintPrompt("Prompt1");
    let comments0 = await prompts.promptComments("Prompt1");
    await prompts.mintPrompt("Comment1", "Prompt1");
    let comments1 = await prompts.promptComments("Prompt1");
    await prompts.mintPrompt("Comment2", "Prompt1");
    let comments2 = await prompts.promptComments("Prompt1");

    let counter2 = await prompts.counter();
    assert.equal(comments0, 0, "comments0 is not 0!");
    assert.equal(comments1, 1, "comments1 is not 1!");
    assert.equal(comments2, 2, "comments2 is not 2!");
  });

  // Checks if promptCommentById() is working properly.
  it('Should promptCommentById() successfully', async () => {
    await prompts.mintPrompt("Prompt1");
    let comm0 = await prompts.promptCommentById("Prompt1", 0);

    await prompts.mintPrompt("Comment1", "Prompt1");
    let comm1 = await prompts.promptCommentById("Prompt1", 1); //Should pass test
    //let comm1 = await prompts.promptCommentById("Prompt1", 2); //Should fail test

    await prompts.mintPrompt("Comment2", "Prompt1");
    let comm2 = await prompts.promptCommentById("Prompt1", 2);

    assert.equal(comm0, "Prompt1", "comm0 is not 'Prompt1'!");
    assert.equal(comm1, "Comment1", "comm1 is not 'Comment1'!");
    assert.equal(comm2, "Comment2", "comm2 is not 'Comment2'!");
  });
});