import subprocess

def add_env():
    env_name = "FRONTEND_URL"
    env_value = b"https://medysa.com"
    
    print(f"Adding {env_name} to Vercel...")
    process = subprocess.run(
        ['npx.cmd', 'vercel', 'env', 'add', env_name, 'production'],
        input=env_value,
        capture_output=True
    )
    print("STDOUT:", process.stdout.decode('utf-8', errors='ignore'))
    print("STDERR:", process.stderr.decode('utf-8', errors='ignore'))

if __name__ == "__main__":
    add_env()
