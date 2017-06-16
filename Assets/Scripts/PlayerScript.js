import UnityEngine.SceneManagement;

var rb : Component;
var jumpVelo : float;
var isGrounded : boolean = false;
var walkVelo : float;

var blancs : GameObject[];
var noirs : GameObject[];

var noir : boolean;

var rotationPoint : GameObject;
var rotationChecker : float;
var rotationCooldown : float;

private var iii : float;
private var iiii : float;

var matNoir : Material;
var matBlanc : Material;
var matRouge : Material;

var levelEnd : boolean;

function Start () {
	noir = true;
	blancs = GameObject.FindGameObjectsWithTag("Blanc");
	noirs = GameObject.FindGameObjectsWithTag("Noir");
	rotationPoint = GameObject.Find("RotationPoint");
	gameObject.GetComponent("MeshRenderer").material = matBlanc;
	Camera.main.backgroundColor = Color.white;
}

function FixedUpdate () {
	playerControls();
//	levelEndChecker();
}

function Switch () {
	rb.constraints = RigidbodyConstraints.FreezePositionX | RigidbodyConstraints.FreezePositionY | RigidbodyConstraints.FreezePositionZ | RigidbodyConstraints.FreezeRotationX | RigidbodyConstraints.FreezeRotationY | RigidbodyConstraints.FreezeRotationZ;
	if (noir) {
		for (var curBloc : GameObject in noirs) {
			curBloc.GetComponent("MeshRenderer").enabled = false;
			curBloc.GetComponent("BoxCollider").enabled = false;
		}
		for (var curBloc : GameObject in blancs) {
			curBloc.GetComponent("MeshRenderer").enabled = true;
			curBloc.GetComponent("BoxCollider").enabled = true;
		}
		noir = false;
		gameObject.GetComponent("MeshRenderer").material = matBlanc;
	}
	else if (!noir) {
		for (var curBloc : GameObject in blancs) {
			curBloc.GetComponent("MeshRenderer").enabled = false;
			curBloc.GetComponent("BoxCollider").enabled = false;
		}
		for (var curBloc : GameObject in noirs) {
			curBloc.GetComponent("MeshRenderer").enabled = true;
			curBloc.GetComponent("BoxCollider").enabled = true;
		}
		noir = true;
		gameObject.GetComponent("MeshRenderer").material = matNoir;
		iiii = 0;
	}
	while (rotationChecker < 1) {
		rotationPoint.transform.Rotate(0,0, 9, Space.Self);
		rotationChecker += 0.05;
		if (!noir) {
			Camera.main.backgroundColor = Color.Lerp(Color.white, Color.black, rotationChecker);
		}
		else if (noir) {
			Camera.main.backgroundColor = Color.Lerp(Color.black, Color.white, rotationChecker);
		}
		yield;
	}
	rotationChecker = 0;
	rb.constraints = RigidbodyConstraints.None;
	rb.constraints = RigidbodyConstraints.FreezePositionZ | RigidbodyConstraints.FreezeRotationX | RigidbodyConstraints.FreezeRotationY | RigidbodyConstraints.FreezeRotationZ;
}

function OnTriggerEnter (hit : Collider) {
	if (hit.gameObject.tag == "fin" && rotationChecker == 0) {
		gameObject.GetComponent("MeshRenderer").material = matRouge;
		for (var curBloc : GameObject in blancs) {
			curBloc.GetComponent("MeshRenderer").enabled = true;
			curBloc.GetComponent("BoxCollider").enabled = true;
		}
		for (var curBloc : GameObject in noirs) {
			curBloc.GetComponent("MeshRenderer").enabled = true;
			curBloc.GetComponent("BoxCollider").enabled = true;
		}
		while (iii < 1800) {
			rotationPoint.transform.Rotate(0,0, 5, Space.Self);
			iii += 1;
			if (iii%2 == 0 && rotationPoint.transform.childCount != 0) {
				Destroy(rotationPoint.transform.GetChild(Mathf.Round(Random.Range(0,rotationPoint.transform.childCount))).gameObject);
			}
			else if (rotationPoint.transform.childCount == 0) {
				yield;
				break;
			}
			yield;
		}
		levelEnd = true;
	}
}

function playerControls () {
	var down : Vector3 = transform.TransformDirection(0,-1,0);
	var right : Vector3 = transform.TransformDirection(1,0,0);
	var left : Vector3 = transform.TransformDirection(-1,0,0);
	rb.velocity.x = Input.GetAxis("Horizontal") * walkVelo;
	if (Physics.Raycast(transform.position, down, 0.605)) {
		isGrounded = true;
	}
	else if (!Physics.Raycast(transform.position, down, 0.605)) {
		isGrounded = false;
	}

	if (Input.GetAxis("Vertical")> 0.01 && isGrounded && Input.GetKey(KeyCode.UpArrow)) {
		 rb.velocity.y = jumpVelo;
	}

	if (Input.GetKeyDown(KeyCode.A) && rotationCooldown > 0 && rotationCooldown == 1) {
		rotationCooldown = 0.99;
		Switch();
	}
	if (rotationCooldown > 0 && rotationCooldown != 1) {
		rotationCooldown -= Time.deltaTime;
	}
	else if (rotationCooldown <= 0) {
		rotationCooldown = 1;
	}
}

function levelEndChecker () {
	if (levelEnd && Input.GetKeyDown(KeyCode.Space)) {
		SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
		Debug.Log("ch");
	}
}