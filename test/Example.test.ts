import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

describe('Test', () => {
  it('returns a hex value', async () => {
    expect('0x123')
      .to.be.a('string')
      .that.matches(/^0x[0-9a-fA-F]+$/);
  });
});
