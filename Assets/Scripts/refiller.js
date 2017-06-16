var noir : GameObject;
var blanc : GameObject;

var i : int;

var x : float;
var y : float;

function Start () {

}

function Update () {
	
}

function fill() {
	while (i <= 64) {
		if (!Physics.Raycast(new Vector3(x, y, 0), transform.TransformDirection(Vector3.forward), Mathf.Infinity)) {
			Instantiate(blanc, new Vector3(x, y, 0.5), Quaternion.Identity);
		}

	}
}