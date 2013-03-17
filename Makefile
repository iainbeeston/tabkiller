# The name of the extension.
extension_name := tabkiller

# The UUID of the extension.
extension_uuid := tabkiller@iainbeeston.com

# The name of the profile dir where the extension can be installed.
profile_dir := tabkiller

# The zip application to be used.
ZIP := zip

# The target XPI file.
xpi_file := $(extension_name).xpi

# The type of operating system this make command is running on.
os_type := $(patsubst darwin%,darwin,$(shell echo $(OSTYPE)))

# The location of the extension profile.
ifeq ($(os_type), darwin)
  profile_location := \
    ~/Library/Application\ Support/Firefox/Profiles/$(profile_dir)/extensions/\{$(extension_uuid)\}
else
  ifeq ($(os_type), linux-gnu)
    profile_location := \
      ~/.mozilla/firefox/$(profile_dir)/extensions/\{$(extension_uuid)\}
  else
    profile_location := \
      "$(subst \,\\,$(APPDATA))\\Mozilla\\Firefox\\Profiles\\$(profile_dir)\\extensions\\{$(extension_uuid)}"
  endif
endif

# The temporary location where the extension tree will be copied and built.
build_dir := build

# This builds the extension XPI file.
.PHONY: all
all: $(xpi_file)
	@echo
	@echo "Build finished successfully."
	@echo

# This cleans all temporary files and directories created by 'make'.
.PHONY: clean
clean:
	@rm -rf $(build_dir)
	@rm -f $(xpi_file)
	@echo "Cleanup is done."

# The sources for the XPI file.
xpi_built := install.rdf \
             chrome.manifest \
             $(wildcard content/tabkiller/*.js) \
             $(wildcard content/tabkiller/*.xul) \
             $(wildcard content/tabkiller/*.xml) \
             $(wildcard content/tabkiller/*.css) \
             $(wildcard defaults/preferences/*.js) \
             $(wildcard locale/*/tabkiller/*.dtd) \
             $(wildcard locale/*/tabkiller/*.css) \
             $(wildcard locale/*/tabkiller/*.properties)

# This builds everything except for the actual XPI, and then it copies it to the
# specified profile directory, allowing a quick update that requires no install.
.PHONY: install
install: $(build_dir) $(xpi_built)
	@echo "Installing in profile folder: $(profile_location)"
	@cp -Rf $(build_dir)/* $(profile_location)
	@echo "Installing in profile folder. Done!"
	@echo


$(xpi_file): $(xpi_built)
	@echo "Creating XPI file."
	@$(ZIP) $(xpi_file) $(xpi_built)
	@echo "Creating XPI file. Done!"
