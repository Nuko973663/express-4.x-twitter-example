let bansho = {
  settings: {},
  currentAccount: "",
};

const handleAccountsChanged = (accounts) => {
  //console.log("Calling HandleChanged");

  if (accounts.length === 0) {
    //console.log("Please connect to MetaMask.");
    $("#enableMetamask").html("Connect with Metamask");
  } else if (accounts[0] !== bansho.currentAccount) {
    bansho.currentAccount = accounts[0];
    console.log(accounts[0]);
    post("/regist", { address: accounts[0] });
  }
};

const connect = () => {
  window.ethereum.on("chainChanged", (_chainId) => window.location.reload());
  bansho.provider = new ethers.providers.Web3Provider(window.ethereum);
  bansho.provider
    .send("eth_requestAccounts", [])
    .then(handleAccountsChanged)
    .catch((err) => {
      if (err.code === 4001) {
        $("#status").html("You refused to connect Metamask");
      } else {
        console.error(err);
      }
    });
};

const changeChainId = (chainId) => {
  ethereum
    .request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainId }],
    })
    .then(init)
    .catch((err) => {
      if (err.code === 4001) {
      } else {
        console.error(err);
      }
    });
};

const detectMetaMask = () => {
  if (typeof window.ethereum !== "undefined") {
    return true;
  } else {
    return false;
  }
};

function post(path, params, method = "post") {
  // The rest of this code assumes you are not using a library.
  // It can be made less wordy if you use one.
  const form = document.createElement("form");
  form.method = method;
  form.action = path;

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const hiddenField = document.createElement("input");
      hiddenField.type = "hidden";
      hiddenField.name = key;
      hiddenField.value = params[key];

      form.appendChild(hiddenField);
    }
  }

  document.body.appendChild(form);
  form.submit();
}

$(document).ready(async function () {
  m = detectMetaMask();
  if (m) {
    $("#connect").attr("disabled", false);
  } else {
    $("#connect").attr("disabled", true);
  }
  $("#connect").click(connect);
});
