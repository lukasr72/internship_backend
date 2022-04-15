export const mochaGlobalSetup = async () => {
  console.log("Before test run")
}

export async function mochaGlobalTeardown() {
  console.log("After test run")
}