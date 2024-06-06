pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

template PasswordCheck() {
    signal input password;
    signal input passwordHash;
    signal input proverAddress;
    signal input senderAddress;

    component p = Poseidon(1);

    p.inputs[0] <== password;
    
    passwordHash === p.out;

    proverAddress === senderAddress;
}

component main {public [passwordHash, senderAddress]} = PasswordCheck();