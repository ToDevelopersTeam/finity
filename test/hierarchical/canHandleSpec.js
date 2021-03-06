import Finity from '../../src';

describe('canHandle', () => {
  let stateMachine;

  beforeEach(() => {
    const grandchildConfig = Finity
      .configure()
        .initialState('state111')
        .on('event3').transitionTo('state112')
      .getConfig();

    const childConfig = Finity
      .configure()
        .initialState('state11')
          .submachine(grandchildConfig)
          .on('event2').transitionTo('state12')
      .getConfig();

    stateMachine = Finity
      .configure()
        .initialState('state1')
          .submachine(childConfig)
          .on('event1').transitionTo('state2')
      .start();
  });

  it('returns true when the event can be handled by a descendant state machine', () => {
    expect(stateMachine.canHandle('event3')).toBe(true);
  });

  it('returns true when the event can be handled by an ancestor state machine', () => {
    expect(stateMachine
      .getSubmachine()
      .getSubmachine()
      .canHandle('event1')
    ).toBe(true);
  });

  it('returns false when the event cannot be handled by any state machine in the hierarchy', () => {
    expect(stateMachine
      .getSubmachine()
      .canHandle('non-handleable')
    ).toBe(false);
  });
});
