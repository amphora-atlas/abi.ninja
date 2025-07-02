describe("Contract Interaction", () => {
  it("should load DAI contract and interact with its balanceOf method", () => {
    cy.visit("http://localhost:3000");
    cy.loadContract("0x6B175474E89094C44Da98b954EedeAC495271d0F");
    cy.url().should("include", "/0x6B175474E89094C44Da98b954EedeAC495271d0F/1");
    cy.interactWithMethod("balanceOf", "0x6B175474E89094C44Da98b954EedeAC495271d0F");
  });

  it("should load proxy contract on Base and interact with its balanceOf method", () => {
    cy.visit("http://localhost:3000");
    cy.selectNetwork("Base");
    cy.loadContract("0xca808b3eada02d53073e129b25f74b31d8647ae0");
    cy.url().should("include", "/0xca808b3eada02d53073e129b25f74b31d8647ae0/8453");
    cy.contains("Implementation Address").should("be.visible");
    cy.interactWithMethod("balanceOf", "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");
  });

  it("should load unverified contract on Sepolia and ADD changeOwner write method to the UI", () => {
    cy.wakeUpHeimdall();
    cy.visit("http://localhost:3000");
    cy.selectNetwork("Sepolia");
    cy.get('input[placeholder="Contract address"]').type("0x759c0e9d7858566df8ab751026bedce462ff42df");
    cy.get("button:visible").contains("Decompile (beta)", { timeout: 10000 }).click({ force: true });
    cy.wait(2000);
    cy.url().should("include", "/0x759c0e9d7858566df8ab751026bedce462ff42df/11155111");
    cy.contains("changeOwner").click();
  });

  it("should load a contract on BNB Smart Chain and interact with its balanceOf method", () => {
    cy.visit("http://localhost:3000");
    cy.selectNetwork("Other chains");
    cy.get("#see-other-chains-modal").should("be.visible");
    cy.contains("BNB Smart Chain").click();
    cy.get(".modal-content").should("not.exist");
    cy.get("#react-select-container").should("contain", "BNB Smart Chain");
    cy.loadContract("0x2170ed0880ac9a755fd29b2688956bd959f933f8");
    cy.url().should("include", "/0x2170ed0880ac9a755fd29b2688956bd959f933f8/56");
    cy.get(".loading-spinner", { timeout: 10000 }).should("not.exist");
    cy.interactWithMethod("balanceOf", "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");
  });

  it("should add Viction as a custom chain and interact with a contract by submitting an ABI manually", () => {
    cy.visit("http://localhost:3000");
    cy.selectNetwork("Add custom chain");
    cy.get("#add-custom-chain-modal").should("be.visible");
    cy.addCustomChain({
      id: "88",
      name: "Viction",
      nativeCurrencyName: "VIC",
      nativeCurrencySymbol: "VIC",
      nativeCurrencyDecimals: "18",
      rpcUrl: "https://rpc.viction.xyz",
      blockExplorer: "https://tomoscan.io/",
    });
    cy.get("#react-select-container").should("contain", "Viction");
    cy.get('input[placeholder="Contract address"]').type("0x381B31409e4D220919B2cFF012ED94d70135A59e");
    cy.fixture("viction_abi").then(victionABI => {
      cy.importABI(JSON.stringify(victionABI));
    });
    cy.url().should("include", "/0x381B31409e4D220919B2cFF012ED94d70135A59e/88");
    cy.get(".loading-spinner", { timeout: 10000 }).should("not.exist");
    cy.interactWithMethod("balanceOf", "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");
  });

  it("should load contract directly via URL path parameters with encoded ABI", () => {
    const contractAddress = "0xB8fCC66d613e5f54ee6A425DDbf4a2fDBE4Dedee";
    const chainId = "1";
    const encodedAbi =
      "W3siaW5wdXRzIjpbeyJpbnRlcm5hbFR5cGUiOiJhZGRyZXNzIiwibmFtZSI6Il9pbml0aWFsT3duZXIiLCJ0eXBlIjoiYWRkcmVzcyJ9XSwic3RhdGVNdXRhYmlsaXR5Ijoibm9ucGF5YWJsZSIsInR5cGUiOiJjb25zdHJ1Y3RvciJ9LHsiaW5wdXRzIjpbeyJpbnRlcm5hbFR5cGUiOiJhZGRyZXNzIiwibmFtZSI6Im93bmVyIiwidHlwZSI6ImFkZHJlc3MifV0sIm5hbWUiOiJPd25hYmxlSW52YWxpZE93bmVyIiwidHlwZSI6ImVycm9yIn0seyJpbnB1dHMiOlt7ImludGVybmFsVHlwZSI6ImFkZHJlc3MiLCJuYW1lIjoiYWNjb3VudCIsInR5cGUiOiJhZGRyZXNzIn1dLCJuYW1lIjoiT3duYWJsZVVuYXV0aG9yaXplZEFjY291bnQiLCJ0eXBlIjoiZXJyb3IifSx7ImFub255bW91cyI6ZmFsc2UsImlucHV0cyI6W3siaW5kZXhlZCI6dHJ1ZSwiaW50ZXJuYWxUeXBlIjoiYWRkcmVzcyIsIm5hbWUiOiJwcmV2aW91c093bmVyIiwidHlwZSI6ImFkZHJlc3MifSx7ImluZGV4ZWQiOnRydWUsImludGVybmFsVHlwZSI6ImFkZHJlc3MiLCJuYW1lIjoibmV3T3duZXIiLCJ0eXBlIjoiYWRkcmVzcyJ9XSwibmFtZSI6Ik93bmVyc2hpcFRyYW5zZmVyU3RhcnRlZCIsInR5cGUiOiJldmVudCJ9LHsiYW5vbnltb3VzIjpmYWxzZSwiaW5wdXRzIjpbeyJpbmRleGVkIjp0cnVlLCJpbnRlcm5hbFR5cGUiOiJhZGRyZXNzIiwibmFtZSI6InByZXZpb3VzT3duZXIiLCJ0eXBlIjoiYWRkcmVzcyJ9LHsiaW5kZXhlZCI6dHJ1ZSwiaW50ZXJuYWxUeXBlIjoiYWRkcmVzcyIsIm5hbWUiOiJuZXdPd25lciIsInR5cGUiOiJhZGRyZXNzIn1dLCJuYW1lIjoiT3duZXJzaGlwVHJhbnNmZXJyZWQiLCJ0eXBlIjoiZXZlbnQifSx7ImlucHV0cyI6W10sIm5hbWUiOiJVUEdSQURFX0lOVEVSRkFDRV9WRVJTSU9OIiwib3V0cHV0cyI6W3siaW50ZXJuYWxUeXBlIjoic3RyaW5nIiwibmFtZSI6IiIsInR5cGUiOiJzdHJpbmcifV0sInN0YXRlTXV0YWJpbGl0eSI6InZpZXciLCJ0eXBlIjoiZnVuY3Rpb24ifSx7ImlucHV0cyI6W10sIm5hbWUiOiJhY2NlcHRPd25lcnNoaXAiLCJvdXRwdXRzIjpbXSwic3RhdGVNdXRhYmlsaXR5Ijoibm9ucGF5YWJsZSIsInR5cGUiOiJmdW5jdGlvbiJ9LHsiaW5wdXRzIjpbXSwibmFtZSI6Im93bmVyIiwib3V0cHV0cyI6W3siaW50ZXJuYWxUeXBlIjoiYWRkcmVzcyIsIm5hbWUiOiIiLCJ0eXBlIjoiYWRkcmVzcyJ9XSwic3RhdGVNdXRhYmlsaXR5IjoidmlldyIsInR5cGUiOiJmdW5jdGlvbiJ9LHsiaW5wdXRzIjpbXSwibmFtZSI6InBlbmRpbmdPd25lciIsIm91dHB1dHMiOlt7ImludGVybmFsVHlwZSI6ImFkZHJlc3MiLCJuYW1lIjoiIiwidHlwZSI6ImFkZHJlc3MifV0sInN0YXRlTXV0YWJpbGl0eSI6InZpZXciLCJ0eXBlIjoiZnVuY3Rpb24ifSx7ImlucHV0cyI6W10sIm5hbWUiOiJyZW5vdW5jZU93bmVyc2hpcCIsIm91dHB1dHMiOltdLCJzdGF0ZU11dGFiaWxpdHkiOiJub25wYXlhYmxlIiwidHlwZSI6ImZ1bmN0aW9uIn0seyJpbnB1dHMiOlt7ImludGVybmFsVHlwZSI6ImFkZHJlc3MiLCJuYW1lIjoiX25ld093bmVyIiwidHlwZSI6ImFkZHJlc3MifV0sIm5hbWUiOiJ0cmFuc2Zlck93bmVyc2hpcCIsIm91dHB1dHMiOltdLCJzdGF0ZU11dGFiaWxpdHkiOiJub25wYXlhYmxlIiwidHlwZSI6ImZ1bmN0aW9uIn0seyJpbnB1dHMiOlt7ImludGVybmFsVHlwZSI6ImNvbnRyYWN0IElUcmFuc3BhcmVudFVwZ3JhZGVhYmxlUHJveHkiLCJuYW1lIjoicHJveHkiLCJ0eXBlIjoiYWRkcmVzcyJ9LHsiaW50ZXJuYWxUeXBlIjoiYWRkcmVzcyIsIm5hbWUiOiJpbXBsZW1lbnRhdGlvbiIsInR5cGUiOiJhZGRyZXNzIn0seyJpbnRlcm5hbFR5cGUiOiJieXRlcyIsIm5hbWUiOiJkYXRhIiwidHlwZSI6ImJ5dGVzIn1dLCJuYW1lIjoidXBncmFkZUFuZENhbGwiLCJvdXRwdXRzIjpbXSwic3RhdGVNdXRhYmlsaXR5IjoicGF5YWJsZSIsInR5cGUiOiJmdW5jdGlvbiJ9XQ";

    cy.visit(`http://localhost:3000/${contractAddress}/${chainId}/${encodedAbi}`);

    cy.url().should("include", `/${contractAddress}/${chainId}/${encodedAbi}`);

    cy.get(".loading-spinner", { timeout: 10000 }).should("not.exist");

    cy.contains(contractAddress).should("be.visible");

    cy.contains("Ethereum").should("be.visible");

    cy.contains("owner").should("be.visible");
    cy.contains("pendingOwner").should("be.visible");
    cy.contains("transferOwnership").should("be.visible");
    cy.contains("acceptOwnership").should("be.visible");
    cy.contains("renounceOwnership").should("be.visible");
    cy.contains("UPGRADE_INTERFACE_VERSION").should("be.visible");
    cy.contains("upgradeAndCall").should("be.visible");

    cy.contains("owner").click();
    cy.get('button[data-testid="read-contract-button"]', { timeout: 5000 }).should("be.visible");

    cy.get('input[placeholder="Contract address"]').should("not.exist");
  });
});
