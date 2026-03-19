import subprocess

def add_env():
    env_name = "GEMINI_API_KEY"
    env_value = b"AIzaSyDTxdMo4PBCNGB7UDhU5O8PpG2TO53XuT8"
    
    print(f"Adding {env_name} to Vercel...")
    
    # Run the npx vercel env add command, piping the exact bytes to stdin
    process = subprocess.run(
        ['npx.cmd', 'vercel', 'env', 'add', env_name, 'production'],
        input=env_value,
        capture_output=True
    )
    
    print("STDOUT:", process.stdout.decode('utf-8', errors='ignore'))
    print("STDERR:", process.stderr.decode('utf-8', errors='ignore'))

if __name__ == "__main__":
    add_env()
