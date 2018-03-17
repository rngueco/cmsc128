import java.util.Arrays;

public class pascal {

	public static void main(String[] args) {
		makeArr(5);
	}
	
	static void makeArr(int n) {
		
		int serye[][] = new int[n][n];
		// reset if necessary
		
		int x = 1;
		
		serye[0][0] = x;
		
		for (int i=1; i<n; i++) {
			for (int j=0; j<i+1; j++) {
				if (j==0 || j==n-1) {
					serye[i][j]=x;
				} else {
					serye[i][j]= serye[i-1][j] + serye[i-1][j-1];
				}
			}
		}
		
		for (int[] z: serye) {
			System.out.println(Arrays.toString(z));
		}
	}

}
