# Ansible groupvars file
ANSIBLE_GROUPVARS_FILE = "ansible/inventories/group_vars/all"
ANSIBLE_BEGIN_TOKEN = "# BEGIN GENERATED CONFIG"
ANSIBLE_END_TOKEN = "# END GENERATED CONFIG"

# MQTT configuration
MQTT_HOST = "mqtts://broker.save-lora.takima.io:8883"
MQTT_PUBLIC_USER = "gotham"
MQTT_PUBLIC_PASSWORD = "IAmTheGodOfGothamAndThisPasswordIsSeri0u$"
MQTT_ADMIN_USER = "admin"
MQTT_PASSWD_FILE_PATH = "ansible/roles/loraserver/files/conf/mosquitto.passwd"

# Save LoRa app server configuration
SAVE_LORA_API_HOST = "api.save-lora.takima.io"
SAVE_LORA_API_PUBLIC_SECRET = "Not so secret... Or is it?"
SAVE_LORA_API_PROXY_SECRET = "IAmTheGodOfGothamAndThisPasswordIsSeri0u$"
SAVE_LORA_API_ADMIN_USERNAME = "admin"
SAVE_LORA_API_ADMIN_PASSWORD = "password"
SAVE_LORA_DB_HOST = "db"
SAVE_LORA_DB_USERNAME = "lorauser"
SAVE_LORA_DB_PASSWORD = "lorapassword"
SAVE_LORA_DB_ROOT_PASSWORD = "root"
SAVE_LORA_DB_DATABASE = "lora"

# LoraServer
LORASERVER_HOST = "loras.save-lora.takima.io"
LORASERVER_JWT_USER = "root"
LORASERVER_DEVICE_PROFILE_ID = "1d99a006-e617-4fb3-9ffe-a71567ee36a7"
LORASERVER_SERVICE_PROFILE_ID = "790bb798-d88c-45bd-9e97-0811b57e7bd0"
LORASERVER_APPLICATION_ID = "1"
LORASERVER_ORGANIZATION_ID = "1"

# Website
SAVE_LORA_WEB_HOST = "www.save-lora.takima.io"

# Docker
SAVE_LORA_API_IMAGE = "resourcepool/save-lora-appserver"
SAVE_LORA_WEB_IMAGE = "resourcepool/save-lora-website"

# Public Git Repo for Players
GIT_REPO = "https://github.com/resourcepool/save-lora.git"
